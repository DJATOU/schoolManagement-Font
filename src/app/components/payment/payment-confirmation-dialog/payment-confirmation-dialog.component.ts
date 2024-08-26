import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Payment } from '../../../models/payment/payment';
import { PaymentDetail } from '../../../models/paymentDetail/paymentDetail';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-payment-confirmation-dialog',
  standalone: true,
  templateUrl: './payment-confirmation-dialog.component.html',
  styleUrls: ['./payment-confirmation-dialog.component.scss'],
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
export class PaymentConfirmationDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<PaymentConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      seriesName: string; 
      seriesPrice: number; 
      paymentDetails: PaymentDetail[]; 
      paymentHistory: Payment[]; 
      totalOwed: number; 
      totalPaid: number; 
    }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Confirm the payment
  }

  onCancel(): void {
    this.dialogRef.close(false); // Cancel the payment
  }
}
