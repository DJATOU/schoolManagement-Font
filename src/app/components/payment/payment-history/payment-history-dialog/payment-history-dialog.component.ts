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

        const pricingId = selectedGroupObject.priceId; // Remplacez `pricingId` par le nom correct du champ dans votre modèle de groupe

        // Ajouter un log pour vérifier l'ID du prix avant d'appeler loadGroupPricing
        console.log('Calling loadGroupPricing with Pricing ID:', pricingId);

        this.loadGroupPricing(pricingId).subscribe({
            next: (pricing) => {
                const sessionPrice = pricing.price ?? 0;

                console.log('Pricing retrieved:', pricing);
                console.log('Session Price:', sessionPrice);

                this.paymentService.getPaymentHistoryForSeries(this.data.studentId, this.selectedSeries!).subscribe({
                    next: (seriesPayments) => {
                        const totalSessions = this.sessionSeries.find(series => series.id === this.selectedSeries)?.totalSessions ?? 0;

                        console.log("Total Sessions:", totalSessions);
                        console.log("Session Price:", sessionPrice);

                        this.seriesTotal = totalSessions * sessionPrice;
                        this.seriesPaid = seriesPayments.reduce((acc, payment) => acc + payment.amountPaid, 0);
                        this.seriesRemaining = this.seriesTotal - this.seriesPaid;
                        this.seriesStatus = this.getSeriesStatus();

                        this.loadSessionPaymentDetails();
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

  
  

loadSessionPaymentDetails(): void {
  if (this.selectedGroup !== null && this.selectedGroup !== undefined && this.selectedSeries !== null && this.selectedSeries !== undefined) {
      // Récupérer le groupe sélectionné à partir de la liste des groupes
      const selectedGroupObject = this.studentGroups.find(group => group.id === this.selectedGroup);

      if (!selectedGroupObject) {
          console.error('Selected group not found in studentGroups array.');
          return;
      }

      const pricingId = selectedGroupObject.priceId; // Remplacez `pricingId` par le nom correct du champ dans votre modèle de groupe

      // Ajouter un log pour vérifier l'ID du prix avant d'appeler loadGroupPricing
      console.log('Calling loadGroupPricing with Pricing ID:', pricingId);

      this.loadGroupPricing(pricingId).subscribe({
          next: (pricing) => {
              const sessionPrice = pricing.price ?? 0;

              console.log('Pricing retrieved:', pricing);
              console.log('Session Price:', sessionPrice);

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
          },
          error: (error: Error) => {
              console.error('Error loading group pricing:', error);
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

  getSessionName(sessionId: number): string {
    const session = this.sessions.find(s => s.id === sessionId);
    return session ? session.title : 'Inconnu';
  }

  getPaymentStatus(detail: PaymentDetail): string {
    const sessionPrice = detail.sessionPrice;
    if (detail.amountPaid >= sessionPrice) {
      return 'Payée';
    } else if (detail.amountPaid > 0 && detail.amountPaid < sessionPrice) {
      return 'Partiellement Payée';
    } else {
      return 'Non Payée';
    }
  }
  



  loadGroupPricing(groupId: number): Observable<{ price: number }> {
    return this.pricingService.getPricingById(groupId); // Retourne l'observable directement
  }
  
  
}
