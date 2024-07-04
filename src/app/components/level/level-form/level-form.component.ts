import { HttpClientModule } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Level } from '../../../models/level/level';
import { LevelService } from '../../../services/level.service';
import { SummaryDialogComponent } from '../../summary-dialog/summary-dialog.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-level-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    HttpClientModule,
    RouterModule,
    MatTab,
    MatTabGroup
  ],
  templateUrl: './level-form.component.html',
  styleUrls: ['./level-form.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class LevelFormComponent {

  
  levelForm = this.fb.group({
    name: ['', Validators.required],
    levelCode: ['', Validators.required],
    description: ['']
  });

  constructor(private fb: FormBuilder, private levelService: LevelService, public dialog: MatDialog) { }

  flattenFormData(data: any, parentKey: string = ''): { label: string, value: any }[] {
    let result: { label: string, value: any }[] = [];
    Object.keys(data).forEach(key => {
      const newKey = parentKey ? `${parentKey} - ${key}` : key;
      const value = data[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result = result.concat(this.flattenFormData(value, newKey));
      } else if (Array.isArray(value)) {
        result.push({ label: newKey, value: value.join(', ') });
      } else {
        result.push({ label: newKey, value: value });
      }
    });
    return result;
  }

  onSubmit(): void {
    if (this.levelForm.valid) {
      const formData = {
        basicInformation: {
          name: this.levelForm.get('name')?.value,
          levelCode: this.levelForm.get('levelCode')?.value,
          description: this.levelForm.get('description')?.value
        }
      };

      const flattenedData = this.flattenFormData(formData);
      console.log('Form Data:', formData);
      console.log('Flattened Data:', flattenedData);

      const dialogRef = this.dialog.open(SummaryDialogComponent, {
        data: flattenedData
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const level: Level = {
            name: formData.basicInformation.name ?? '',
            levelCode: formData.basicInformation.levelCode ?? '',
            description: formData.basicInformation.description ?? ''
          };
          
          this.levelService.createLevel(level).subscribe({
            next: (level) => {
              console.log('Level created:', level);
              this.onClearForm();
              // Handle successful response
            },
            error: (error) => {
              console.error('Error creating level:', error);
              // Handle error response
            }
          });
        } else {
          console.warn('Form submission was cancelled.');
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
