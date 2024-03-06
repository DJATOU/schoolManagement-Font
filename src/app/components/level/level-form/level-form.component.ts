import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { Level } from '../../../models/level/level';
import { LevelService } from '../../../services/level.service';

@Component({
  selector: 'app-level-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './level-form.component.html',
  styleUrl: './level-form.component.scss'
})
export class LevelFormComponent {

  levelForm = this.fb.group({
    name: ['', Validators.required],
    levelCode: ['', Validators.required],
    description: ['']
  });

  constructor(private fb: FormBuilder,private levelService: LevelService) { }

  

  onSubmit(): void {
    if (this.levelForm.valid) {
      const formValue = this.levelForm.value;
  
      const level: Level = {
        name: formValue.name ?? '',
        levelCode: formValue.levelCode ?? '',
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
