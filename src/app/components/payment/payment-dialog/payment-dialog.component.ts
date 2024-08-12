import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
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
    const sessionSeriesId = paymentData.sessionSeriesId;
    this.paymentService.getPaymentDetailsForSeries(this.studentId, sessionSeriesId).subscribe({
      next: (paymentDetails) => {
        this.paymentService.getPaymentHistoryForSeries(this.studentId, sessionSeriesId).subscribe({
          next: (paymentHistory) => {
            const totalPaidPreviously = paymentHistory.reduce((acc, curr) => acc + curr.amountPaid, 0);
            const totalOwed = paymentHistory[0]?.amountOwed || 0;
            const remainingAmount = totalOwed - (totalPaidPreviously + paymentData.amountPaid);

            // Ajout des logs pour vérifier les valeurs
            console.log('Total Owed:', totalOwed);
            console.log('Total Paid Previously:', totalPaidPreviously);
            console.log('Payment Data Amount Paid:', paymentData.amountPaid);
            console.log('Remaining Amount:', remainingAmount);

            const dialogRef = this.dialog.open(PaymentConfirmationDialogComponent, {
              width: '500px',
              data: {
                paymentDetails: paymentDetails,
                paymentHistory: paymentHistory,
                totalPaid: totalPaidPreviously + paymentData.amountPaid,
                totalOwed: totalOwed,
                remainingAmount: remainingAmount
              }
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.submitPayment(paymentData);
              }
            });
          },
          error: (err) => {
            console.error('Error fetching payment history:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching payment details:', err);
      }
    });
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
        this.snackBar.open('Payment successful', 'Close', { duration: 3000 });
        this.dialogRef.close(response);
      },
      error: (err) => {
        console.error('Error processing payment:', err);
        this.snackBar.open('An error occurred while processing the payment.', 'Close', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
