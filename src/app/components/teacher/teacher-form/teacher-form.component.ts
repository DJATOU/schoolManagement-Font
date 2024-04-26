import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOption, NativeDateAdapter } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { TeacherService } from '../../../services/teacher.service';
import { MatSelectModule } from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule,
    HttpClientModule,
    MatNativeDateModule,
    RouterModule,
    MatStepperModule, 
    MatIconModule,
    MatOption,
    MatSelectModule,
    MatTabsModule
  ],
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss'],
  providers: [
    TeacherService,
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'us-US' },
    {
      provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: 'LL',
        },
        display: {
          dateInput: 'LL',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      }
    }
  ]
})

export class TeacherFormComponent  {
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private teacherService: TeacherService) {}

    teacherForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      placeOfBirth: [''],
      address: [''],
      communicationPreference: [''],
      specialization: [''],
      qualifications: [''],
      yearsOfExperience: ['', Validators.pattern("^[0-9]*$")],
      groupIds: [[]]
    });
  

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {
      const formData = new FormData();
      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }
      Object.keys(this.teacherForm.value).forEach(key => {
        const value = this.teacherForm.get(key)?.value;
        formData.append(key, value);
      });

      this.teacherService.createTeacher(formData).subscribe({
        next: (response) => {
          console.log('Teacher created:', response);
          this.onClearForm();
        },
        error: (error) => {
          console.error('Error creating teacher:', error);
        }
      });
    } else {
      console.warn('The form is not valid or the file is not selected.');
    }
  }

  onClearForm(): void {
    this.teacherForm.reset();
    this.selectedFile = null;
  }
}