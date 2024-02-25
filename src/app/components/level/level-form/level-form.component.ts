import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule} from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { LevelService } from '../../../services/level.service';
import { Level } from '../../../models/level/level';

@Component({
  selector: 'app-level-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule,
    MatSelectModule,
    HttpClientModule,
    MatNativeDateModule,RouterModule,MatStepperModule],
  templateUrl: './level-form.component.html',
  styleUrl: './level-form.component.scss'
})
export class LevelFormComponent {

  levelForm = this.fb.group({
    name: ['', Validators.required],
    levelCode: ['', Validators.required],
    dateCreation: [''],
    dateUpdate: [''],
    createdBy: [''],
    updatedBy: [''],
    active: ['', Validators.required],
    description: ['']
  });

  constructor(private fb: FormBuilder,private levelService: LevelService) { }

  

  onSubmit(): void {
    if (this.levelForm.valid) {
      const formValue = this.levelForm.value;
  
      const level: Level = {
        id: 0,
        name: formValue.name ?? '',
        levelCode: formValue.levelCode ?? '',
        dateCreation: formValue.dateCreation ? new Date(formValue.dateCreation) : new Date(),
        dateUpdate: formValue.dateUpdate ? new Date(formValue.dateUpdate) : new Date(),
        createdBy: formValue.createdBy ?? '',
        updatedBy: formValue.updatedBy ?? '',
        active: formValue.active == 'true',
        description: formValue.description ?? ''
      };
      
      this.levelService.createLevel(level).subscribe({
        next: (level) => {
          console.log('Level created:', level);
          // Handle successful response
        },
        error: (error) => {
          console.error('Error creating level:', error);
          // Handle error response
        }
      });
    } else {
      console.warn('Form is not valid');
    }
  }

  onClearForm() {
    this.levelForm.reset();
  }
}
