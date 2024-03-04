import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject/subject';

@Component({
  selector: 'app-subject-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    HttpClientModule,
    RouterModule,
  ],
  templateUrl: './subject-form.component.html',
  styleUrl: './subject-form.component.scss'
})
export class SubjectFormComponent {
  subjectForm = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  constructor(private fb: FormBuilder,private subjectService: SubjectService) { }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      const formValue = this.subjectForm.value;
  
      const subject: Subject = {
        name: formValue.name ?? '',
        description: formValue.description ?? ''
      };
      console.log(subject);
      this.subjectService.createSubject(subject).subscribe({
        next: (subject) => {
          console.log('subject created:', subject);
          // Handle successful response
        },
        error: (error) => {
          console.error('Error creating subject:', error);
          // Handle error response
        }
      });
    } else {
      console.warn('Form is not valid');
    }
  }

  onClearForm() {
    this.subjectForm.reset();
  }
}
