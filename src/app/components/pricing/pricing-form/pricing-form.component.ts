import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { Pricing } from '../../../models/pricing/pricing';
import { PricingService } from '../../../services/pricing.service';

@Component({
  selector: 'app-pricing-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule,
    HttpClientModule,
    MatNativeDateModule,
    RouterModule
  ],
  templateUrl: './pricing-form.component.html',
  styleUrl: './pricing-form.component.scss'
})
export class PricingFormComponent {
  pricingForm = this.fb.group({
    price: ['', [Validators.required, Validators.min(0)]],
    effectiveDate: ['', Validators.required],
    expirationDate: ['', Validators.required],
    description: ['']
  });

  constructor(private fb: FormBuilder,private pricingService: PricingService) { }

  

  onSubmit(): void {
    console.log(this.pricingForm.value);
    if (this.pricingForm.valid) {
      const formValue = this.pricingForm.value;
  
      const pricing: Pricing = {
        price: formValue.price ? parseInt(formValue.price) : 0,
        effectiveDate: formValue.effectiveDate ? new Date(formValue.effectiveDate) : new Date(),
        expirationDate: formValue.expirationDate ? new Date(formValue.expirationDate) : new Date(),
        description: formValue.description ?? ''
      };
      this.pricingService.createPricing(pricing).subscribe({
        next: (pricing) => {
          console.log('pricing created:', pricing);
          // Handle successful response
        },
        error: (error) => {
          console.error('Error creating pricing:', error);
          // Handle error response
        }
      });
    } else {
      console.warn('Form is not valid');
    }
  }

  onClearForm() {
    this.pricingForm.reset();
  }
}

