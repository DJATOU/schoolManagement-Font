import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { Teacher } from '../../../models/teacher/teacher';
import { TeacherService } from '../../../services/teacher.service';
import { MatSelectModule } from '@angular/material/select';

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
    MatStepperModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './teacher-form.component.html',
  styleUrl: './teacher-form.component.scss'
})
export class TeacherFormComponent {
  teacherForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    gender: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    placeOfBirth: ['']
  });

  constructor(private fb: FormBuilder,private teacherService: TeacherService) { }

  

  onSubmit(): void {
    if (this.teacherForm.valid) {
      const formValue = this.teacherForm.value;
  
      const teacher: Teacher = {
        firstName: formValue.firstName ?? '',
        lastName: formValue.lastName ?? '',
        email: formValue.email ?? '',
        gender: formValue.gender ?? '',
        phoneNumber: formValue.phoneNumber ?? '',
        dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : new Date(),
        placeOfBirth: formValue.placeOfBirth ?? '',
        groups: []
      };
  
      this.teacherService.createTeacher(teacher).subscribe({
        next: (teacher) => {
          console.log('teacher created:', teacher);
          // Handle successful response
        },
        error: (error) => {
          console.error('Error creating teacher:', error);
          // Handle error response
        }
      });
    } else {
      console.warn('Form is not valid');
    }
  }

  onClearForm() {
    this.teacherForm.reset();
  }
}
