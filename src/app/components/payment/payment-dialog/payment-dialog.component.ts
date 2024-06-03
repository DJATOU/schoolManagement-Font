import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Group } from '../../../models/group/group';

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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groups: Group[] }
  ) {
    this.groups = data.groups;
    this.paymentForm = this.fb.group({
      groupId: [null, Validators.required],
      session: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]]
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.dialogRef.close(this.paymentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
