import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student/student';
import { RouterModule } from '@angular/router';
import {MatStepperModule} from '@angular/material/stepper';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule,
    HttpClientModule,
    MatNativeDateModule,
    MatStepperModule,
    RouterModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
  providers: [
    StudentService ,
    { provide: DateAdapter, useClass: NativeDateAdapter  },
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
export class StudentFormComponent  {
  studentForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    dateOfBirth: ['', Validators.required],
    placeOfBirth: [''],
    photo: [''],
    level: ['', Validators.required],
    groupIds: [''],
    tutorId: [''],
    establishment: [''],
    averageScore: ['']
  });

  constructor(private fb: FormBuilder,private studentService: StudentService) { }

  

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;
  
      const student: Student = {
        firstName: formValue.firstName ?? '',
        lastName: formValue.lastName ?? '',
        email: formValue.email ?? '',
        phoneNumber: formValue.phoneNumber ?? '',
        dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : new Date(),
        placeOfBirth: formValue.placeOfBirth ?? '',
        photo: formValue.photo,
        level: formValue.level ?? '',
        groupIds: formValue.groupIds ? formValue.groupIds.split(',').map(Number) : [], // Remove the array fallback
        tutorId: formValue.tutorId ? Number(formValue.tutorId) : undefined,
        establishment: formValue.establishment ?? '',
        averageScore: formValue.averageScore !== null && formValue.averageScore ? Number(formValue.averageScore) : undefined,
      };
  
      this.studentService.createStudent(student).subscribe({
        next: (student) => {
          console.log('Student created:', student);
          // Handle successful response
        },
        error: (error) => {
          console.error('Error creating student:', error);
          // Handle error response
        }
      });
    } else {
      console.warn('Form is not valid');
    }
  }

  onClearForm() {
    this.studentForm.reset();
  }
  
}
