import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject/subject';
import { SummaryDialogComponent } from '../../summary-dialog/summary-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subject-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    CommonModule
  ],
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss']
})
export class SubjectFormComponent {
  subjectForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

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
    if (this.subjectForm.valid) {
      const formData = {
        basicInformation: {
          name: this.subjectForm.get('name')?.value,
          description: this.subjectForm.get('description')?.value
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
          const subject: Subject = {
            name: formData.basicInformation.name ?? '',
            description: formData.basicInformation.description ?? ''
          };

          this.subjectService.createSubject(subject).subscribe({
            next: (subject) => {
              console.log('Subject created:', subject);
              this.onClearForm();
              this.showSuccessMessage('Subject created successfully.');
            },
            error: (error) => {
              console.error('Error creating subject:', error);
              this.showErrorMessage('Error creating subject.');
            }
          });
        } else {
          console.warn('Form submission was cancelled.');
        }
      });
    } else {
      console.warn('Form is not valid');
      this.showErrorMessage('Form is not valid.');
    }
  }

  onClearForm(): void {
    this.subjectForm.reset();
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['snack-bar-success']
    });
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['snack-bar-error']
    });
  }
}
