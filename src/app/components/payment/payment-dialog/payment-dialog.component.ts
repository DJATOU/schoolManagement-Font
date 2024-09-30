import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Group } from '../../../models/group/group';
import { SessionSeries } from '../../../models/sessionSerie/sessionSerie';
import { SeriesService } from '../../../services/series.service';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '../../../models/payment/payment';
import { PaymentConfirmationDialogComponent } from '../payment-confirmation-dialog/payment-confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentDetail } from '../../../models/paymentDetail/paymentDetail';
import { PricingService } from '../../../services/pricing.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class PaymentDialogComponent implements OnInit {
  paymentForm: FormGroup;
  groups: Group[];
  sessionSeries: SessionSeries[] = [];
  studentId: number;
  paymentDetails: PaymentDetail[] = [];
  totalAmountPaid = 0;
  totalAmountOwed = 0;
  remainingAmount = 0;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    private sessionSeriesService: SeriesService,
    private paymentService: PaymentService,
    private pricingService :PricingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { studentId: number, groups: Group[] }
    
  ) {
    this.groups = data.groups;
    this.studentId = data.studentId;

    this.paymentForm = this.fb.group({
      groupId: [null, Validators.required],
      sessionSeriesId: [null, Validators.required],
      amountPaid: [null, [Validators.required, Validators.min(0)]],
      paymentMethod: ['', Validators.required],
      paymentDescription: ['']
    });
  }

  ngOnInit(): void {
    this.paymentForm.get('groupId')!.valueChanges.subscribe(groupId => {
      this.loadSessionSeries(groupId);
    });
  }

  loadSessionSeries(groupId: number): void {
    if (groupId) {
      this.sessionSeriesService.getSessionSeriesByGroupId(groupId).subscribe({
        next: (series) => {
          this.sessionSeries = series;
          this.paymentForm.get('sessionSeriesId')!.setValue(null);
        },
        error: (err) => {
          console.error('Error loading session series:', err);
        }
      });
    }
  }

  openConfirmationDialog(paymentData: Payment): void {
    const sessionSeries = this.sessionSeries.find(series => series.id === paymentData.sessionSeriesId);
    const seriesName = sessionSeries?.name || 'Unknown Series';
  
    // Charger le groupe pour obtenir le priceId et récupérer les informations de tarification
    const group = this.groups.find(group => group.id === sessionSeries?.groupId);
    if (group?.priceId) {
      this.pricingService.getPricingById(group.priceId).subscribe({
        next: (pricing) => {
          const pricePerSession = pricing.price;
          const totalSessionsInSeries = group.sessionNumberPerSerie;
          const groupPrice = pricePerSession * totalSessionsInSeries;
  
          // Calculer le coût total des sessions créées
          const totalCreatedSessionsCost = sessionSeries!.numberOfSessionsCreated * pricePerSession;
  
          // Récupérer le montant total déjà payé par l'étudiant pour cette série
          this.paymentService.getPaymentHistoryForSeries(this.studentId, paymentData.sessionSeriesId).subscribe({
            next: (paymentHistory) => {
              const totalPaidPreviously = paymentHistory.reduce((acc, curr) => acc + curr.amountPaid, 0);
              const newTotalPaid = totalPaidPreviously + paymentData.amountPaid;
  
              // Vérifier si le nouveau total payé dépasse le coût total de la série
              if (newTotalPaid > groupPrice) {
                const surplus = newTotalPaid - groupPrice;
                this.snackBar.open(
                  `Le montant payé dépasse le coût total de la série de ${surplus} euros.`,
                  'Fermer',
                  { duration: 5000 }
                );
                return;
              }
  
              // Vérifier si le nouveau total payé dépasse le coût des sessions créées
              if (newTotalPaid > totalCreatedSessionsCost) {
                this.snackBar.open(
                  "Le paiement ne peut pas être effectué car il dépasse le coût des sessions actuellement créées. Veuillez completer la création des sessions pour cette série.",
                  'Fermer',
                  { duration: 5000 }
                );
                return;
              }
  
              // Si tout est en ordre, calculer le montant restant
              const remainingAmount = groupPrice - newTotalPaid;
  
              // Récupérer les détails de paiement pour la série
              this.paymentService.getPaymentDetailsForSeries(this.studentId, paymentData.sessionSeriesId).subscribe({
                next: (paymentDetails) => {
                  // Ouvrir le dialogue de confirmation avec les données nécessaires
                  const dialogRef = this.dialog.open(PaymentConfirmationDialogComponent, {
                    width: '500px',
                    data: {
                      seriesName: seriesName,
                      seriesPrice: groupPrice,
                      paymentDetails: paymentDetails,
                      paymentHistory: paymentHistory,
                      totalPaid: newTotalPaid,
                      totalOwed: groupPrice,
                      remainingAmount: remainingAmount
                    }
                  });
  
                  // Après la fermeture du dialogue de confirmation
                  dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                      this.submitPayment(paymentData);
                    }
                  });
                },
                error: (err) => {
                  console.error('Erreur lors de la récupération des détails de paiement:', err);
                }
              });
            },
            error: (err) => {
              console.error('Erreur lors de la récupération de l’historique des paiements:', err);
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des informations de tarification:', err);
        }
      });
    } else {
      this.snackBar.open('Les informations de tarification du groupe sont introuvables.', 'Fermer', { duration: 5000 });
    }
  }
  
  onSubmit(): void {
    if (this.paymentForm.valid) {
      const paymentData: Payment = {
        ...this.paymentForm.value,
        studentId: this.studentId
      };

      this.openConfirmationDialog(paymentData);
    }
  }

  submitPayment(paymentData: Payment): void {
    this.paymentService.addPayment(paymentData).subscribe({
      next: (response) => {
        this.snackBar.open('Paiement effectué avec succès', 'Fermer', { duration: 3000 });
        this.dialogRef.close(response);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur lors du traitement du paiement:', err);
        let errorMessage = 'Une erreur est survenue lors du traitement du paiement.';
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }
        this.snackBar.open(errorMessage, 'Fermer', { duration: 5000 });
      }
    });
  }
  

  onCancel(): void {
    this.dialogRef.close();
  }
}
