import { Component, Inject, OnInit } from '@angular/core';
import { PaymentDetail } from '../../../../models/paymentDetail/paymentDetail';
import { Group } from '../../../../models/group/group';
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
import { StudentService } from '../../../student/services/student.service';
import { PricingService } from '../../../../services/pricing.service';
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
  paymentHistory = new MatTableDataSource<PaymentDetail>();

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
    private pricingService: PricingService,
    public dialogRef: MatDialogRef<PaymentHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { studentId: number }
  ) {}

  ngOnInit(): void {
    this.loadStudentInfo();
    this.loadGroups();
  }

  private loadStudentInfo(): void {
    this.studentService.getStudentById(this.data.studentId).subscribe({
      next: (student) => {
        this.studentName = `${student.firstName} ${student.lastName}`;
      },
      error: (error) => {
        console.error('Error loading student info:', error);
      }
    });
  }

  private loadGroups(): void {
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
        },
        error: (error) => {
          console.error('Error loading session series:', error);
        }
      });
    }
  }

  loadPaymentHistory(): void {
    if (this.selectedSeries && this.selectedGroup) {
      const selectedGroupObject = this.studentGroups.find(group => group.id === this.selectedGroup);

      if (!selectedGroupObject) {
        console.error('Selected group not found in studentGroups array.');
        return;
      }

      const pricingId = selectedGroupObject.priceId;

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

  private loadSessionPaymentDetails(sessionPrice: number): void {
    if (this.selectedGroup !== null && this.selectedSeries !== null) {
      this.paymentService.getPaymentDetailsForSessions(this.data.studentId, this.selectedSeries).subscribe({
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

  private getPaymentStatusWithPrice(detail: PaymentDetail, sessionPrice: number): string {
    if (detail.amountPaid >= sessionPrice) {
      return 'Payée';
    } else if (detail.amountPaid > 0 && detail.amountPaid < sessionPrice) {
      return 'Partiellement Payée';
    } else {
      return 'Non Payée';
    }
  }

  private getSeriesStatus(): string {
    if (this.seriesRemaining === 0) {
      return 'Payée';
    } else if (this.seriesPaid > 0) {
      return 'Partiellement Payée';
    } else {
      return 'Non Payée';
    }
  }

  private loadGroupPricing(groupId: number): Observable<{ price: number }> {
    return this.pricingService.getPricingById(groupId);
  }

  private getFillColorForStatus(status: string): string {
    switch (status) {
      case 'Payée':
        return '#d0f0c0'; // Vert
      case 'Partiellement Payée':
        return '#ffe4b5'; // Orange
      case 'Non Payée':
        return '#ffcccb'; // Rouge
      default:
        return '#ffffff'; // Blanc
    }
  }

  // Méthode pour convertir l'image en Base64
  private convertImageToBase64(url: string): Promise<string> {
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
    let logoBase64 = '';
    try {
      logoBase64 = await this.convertImageToBase64('assets/succes_assistance.png');
    } catch (error) {
      console.error('Erreur lors du chargement du logo :', error);
    }

    const documentDefinition: TDocumentDefinitions = {
      content: [
        {
          columns: [
            {
              image: logoBase64,
              width: 100
            },
            {
              text: 'Historique des Paiements',
              style: 'header',
              alignment: 'right'
            }
          ]
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
        this.getPaymentHistoryTable(),
        { text: '\n\n' },
        {
          text: 'Signature étudiant : ________________________',
          alignment: 'right',
          margin: [0, 50, 0, 0]
        },
        {
          text: 'Signature de l\'Administration : ________________________',
          alignment: 'right',
          margin: [0, 50, 0, 0]
        }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
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

    pdfDocGenerator.getBlob((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    });
  }

  private getPaymentHistoryTable(): any {
    const body = [];

    // En-têtes du tableau
    body.push([
      { text: 'Session', style: 'tableHeader' },
      { text: 'Date de Paiement', style: 'tableHeader' },
      { text: 'Montant Payé', style: 'tableHeader' },
      { text: 'Statut du Paiement', style: 'tableHeader' }
    ]);

    // Données du tableau
    if (this.paymentHistory.data && this.paymentHistory.data.length > 0) {
      for (const payment of this.paymentHistory.data) {
        const status = payment.status || 'N/A';
        const fillColor = this.getFillColorForStatus(status);

        body.push([
          { text: payment.sessionName || 'N/A', fillColor },
          { text: payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A', fillColor },
          { text: `${payment.amountPaid} DA`, fillColor },
          { text: status, fillColor }
        ]);
      }
    } else {
      body.push([
        { text: 'Aucun paiement trouvé', colSpan: 4, alignment: 'center' }
      ]);
    }

    return {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*'],
        body: body
      },
      layout: 'lightHorizontalLines'
    };
  }
}
