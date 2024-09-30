import { Component, Inject, OnInit } from '@angular/core';
import { PaymentDetail } from '../../../../models/paymentDetail/paymentDetail';
import { Group } from '../../../../models/group/group';
import { Session } from '../../../../models/session/session';
import { SessionSeries } from '../../../../models/sessionSerie/sessionSerie';
import { PaymentService } from '../../../../services/payment.service';
import { SeriesService } from '../../../../services/series.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StudentService } from '../../../../services/student.service';
import { PricingService } from '../../../../services/pricing.service';
import { SessionService } from '../../../../services/SessionService';
import { Observable } from 'rxjs';

// Importations pour pdfMake
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

@Component({
  selector: 'app-payment-history-dialog',
  standalone: true,
  templateUrl: './payment-history-dialog.component.html',
  styleUrls: ['./payment-history-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule
  ]
})
export class PaymentHistoryDialogComponent implements OnInit {
  studentGroups: Group[] = [];
  sessionSeries: SessionSeries[] = [];
  sessions: Session[] = [];
  paymentHistory: MatTableDataSource<PaymentDetail> = new MatTableDataSource<PaymentDetail>();

  selectedGroup: number | null = null;
  selectedSeries: number | null = null;

  seriesTotal = 0;
  seriesPaid = 0;
  seriesRemaining = 0;
  seriesStatus = '';

  displayedColumns: string[] = ['session', 'paymentDate', 'amountPaid', 'paymentStatus'];

  studentName: string = '';

  constructor(
    private paymentService: PaymentService,
    private studentService: StudentService,
    private seriesService: SeriesService,
    private sessionService: SessionService,
    private pricingService: PricingService,
    public dialogRef: MatDialogRef<PaymentHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { studentId: number }
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadStudentInfo();
  }

  loadStudentInfo(): void {
    this.studentService.getStudentById(this.data.studentId).subscribe({
      next: (student) => {
        this.studentName = `${student.firstName} ${student.lastName}`;
      },
      error: (error) => {
        console.error('Error loading student info:', error);
      }
    });
  }

  loadGroups(): void {
    this.studentService.getGroupsForStudent(this.data.studentId).subscribe({
      next: (groups) => {
        this.studentGroups = groups;
      },
      error: (error) => {
        console.error('Error loading groups:', error);
      }
    });
  }

  loadSessionSeries(): void {
    if (this.selectedGroup) {
      this.seriesService.getSessionSeriesByGroupId(this.selectedGroup).subscribe({
        next: (series) => {
          this.sessionSeries = series;
          this.selectedSeries = null;
          this.paymentHistory.data = [];
          this.sessions = [];
        },
        error: (error) => {
          console.error('Error loading session series:', error);
        }
      });
    }
  }

  loadPaymentHistory(): void {
    if (this.selectedSeries && this.selectedGroup) {
      // Récupérer le groupe sélectionné à partir de la liste des groupes
      const selectedGroupObject = this.studentGroups.find(group => group.id === this.selectedGroup);

      if (!selectedGroupObject) {
        console.error('Selected group not found in studentGroups array.');
        return;
      }

      const pricingId = selectedGroupObject.priceId; // Assurez-vous que le champ correspond

      // Charger le prix du groupe
      this.loadGroupPricing(pricingId).subscribe({
        next: (pricing) => {
          const sessionPrice = pricing.price ?? 0;

          this.paymentService.getPaymentHistoryForSeries(this.data.studentId, this.selectedSeries!).subscribe({
            next: (seriesPayments) => {
              const totalSessions = this.sessionSeries.find(series => series.id === this.selectedSeries)?.totalSessions ?? 0;

              this.seriesTotal = totalSessions * sessionPrice;
              this.seriesPaid = seriesPayments.reduce((acc, payment) => acc + payment.amountPaid, 0);
              this.seriesRemaining = this.seriesTotal - this.seriesPaid;
              this.seriesStatus = this.getSeriesStatus();

              this.loadSessionPaymentDetails(sessionPrice);
            },
            error: (error: Error) => {
              console.error('Error loading payment history for series:', error);
            }
          });
        },
        error: (error: Error) => {
          console.error('Error loading group pricing:', error);
        }
      });
    } else {
      console.error('Selected series or group is null or undefined.');
    }
  }

  loadSessionPaymentDetails(sessionPrice: number): void {
    if (this.selectedGroup !== null && this.selectedGroup !== undefined && this.selectedSeries !== null && this.selectedSeries !== undefined) {
      this.paymentService.getPaymentDetailsForSessions(this.data.studentId, this.selectedSeries!).subscribe({
        next: (paymentDetails) => {
          this.paymentHistory.data = paymentDetails.map(detail => ({
            sessionId: detail.sessionId,
            sessionName: detail.sessionName,
            paymentMethod: detail.paymentMethod || 'Cash',
            description: detail.description || 'Aucune description',
            paymentDate: detail.paymentDate,
            amountPaid: detail.amountPaid,
            status: this.getPaymentStatusWithPrice(detail, sessionPrice),
            sessionPrice: sessionPrice
          }));
        },
        error: (error: Error) => {
          console.error('Error loading session payment details:', error);
        }
      });
    } else {
      console.error('Selected group or selected series is null or undefined.');
    }
  }

  getPaymentStatusWithPrice(detail: PaymentDetail, sessionPrice: number): string {
    if (detail.amountPaid >= sessionPrice) {
      return 'Payée';
    } else if (detail.amountPaid > 0 && detail.amountPaid < sessionPrice) {
      return 'Partiellement Payée';
    } else {
      return 'Non Payée';
    }
  }

  getSeriesStatus(): string {
    if (this.seriesRemaining === 0) {
      return 'Payée';
    } else if (this.seriesPaid > 0) {
      return 'Partiellement Payée';
    } else {
      return 'Non Payée';
    }
  }

  loadGroupPricing(groupId: number): Observable<{ price: number }> {
    return this.pricingService.getPricingById(groupId);
  }

  // Méthode pour convertir l'image en Base64 (si nécessaire pour le logo)
  convertImageToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
    });
  }

  async generatePdf(): Promise<void> {
    const documentDefinition: TDocumentDefinitions = {
      content: [
        {
          text: 'Historique des Paiements',
          style: 'header',
          alignment: 'center'
        },
        { text: '\n\n' },
        {
          text: `Étudiant : ${this.studentName}`,
          style: 'subheader'
        },
        {
          text: `Date : ${new Date().toLocaleDateString()}`,
          alignment: 'right'
        },
        { text: '\n' },
        {
          text: `${this.sessionSeries.find(series => series.id === this.selectedSeries)?.name}`,
          style: 'sectionHeader'
        },
        {
          columns: [
            { text: `Montant Total : ${this.seriesTotal} DA`, width: '50%' },
            { text: `Montant Payé : ${this.seriesPaid} DA`, width: '50%' }
          ]
        },
        {
          columns: [
            { text: `Reste à Payer : ${this.seriesRemaining} DA`, width: '50%' },
            { text: `Statut : ${this.seriesStatus}`, width: '50%' }
          ]
        },
        { text: '\n' },
        {
          text: 'Détails des Paiements',
          style: 'sectionHeader'
        },
        this.getPaymentHistoryTable()
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: 'center',
          color: '#2F5496',
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        sectionHeader: {
          fontSize: 18,
          bold: true,
          color: '#2F5496',
          margin: [0, 15, 0, 10]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'white',
          fillColor: '#4F81BD',
          alignment: 'center'
        },
        tableCell: {
          margin: [0, 5, 0, 5]
        }
      },
      footer: (currentPage: number, pageCount: number): Content => {
        return {
          text: `Page ${currentPage} sur ${pageCount}`,
          alignment: 'center',
          fontSize: 10,
          margin: [0, 10, 0, 0]
        } as Content;
      }
    };
  
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
  
    // Ouvrir le PDF dans une nouvelle fenêtre de manière sécurisée
    pdfDocGenerator.getBlob((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    });
  }
  
  getPaymentHistoryTable(): any {
    const body = [];
  
    // En-têtes du tableau
    body.push([
      { text: 'Session', style: 'tableHeader' },
      { text: 'Date de Paiement', style: 'tableHeader' },
      { text: 'Montant Payé', style: 'tableHeader' },
      { text: 'Statut du Paiement', style: 'tableHeader' }
    ]);
  
    // Données du tableau
    for (const payment of this.paymentHistory.data) {
      body.push([
        payment.sessionName,
        payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A',
        `${payment.amountPaid} DA`,
        payment.status
      ]);
    }
  
    return {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*'],
        body: body
      },
      layout: {
        fillColor: (rowIndex: number) => {
          return rowIndex % 2 === 0 ? '#F3F3F3' : null;
        },
        hLineWidth: () => 0,
        vLineWidth: () => 0
      }
    };
  }
  
}
