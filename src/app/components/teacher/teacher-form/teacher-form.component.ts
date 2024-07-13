import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TeacherService } from '../../../services/teacher.service';
import { SummaryDialogComponent } from '../../summary-dialog/summary-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatTabsModule,
    MatSnackBarModule,
    CommonModule,
    MatCardModule
  ],
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss'],
  providers: [TeacherService]
})
export class TeacherFormComponent {
  selectedFile: File | null = null;
  teacherForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.teacherForm = this.fb.group({
      basicInformation: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['', Validators.required],
        photo: ['']
      }),
      contactInformation: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        address: [''],
        city: ['']
      }),
      professionalDetails: this.fb.group({
        dateOfBirth: ['', Validators.required],
        placeOfBirth: [''],
        specialization: [''],
        qualifications: ['']
      }),
      otherInformation: this.fb.group({
        yearsOfExperience: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        nationality: [''],
        maritalStatus: [''],
        communicationPreference: ['']
      })
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
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
    if (this.teacherForm.valid && this.selectedFile) {
      const formData = {
        basicInformation: this.teacherForm.get('basicInformation')?.value,
        contactInformation: this.teacherForm.get('contactInformation')?.value,
        professionalDetails: this.teacherForm.get('professionalDetails')?.value,
        otherInformation: this.teacherForm.get('otherInformation')?.value,
        photo: this.selectedFile?.name
      };

      const flattenedData = this.flattenFormData(formData).filter(item => item.label !== 'basicInformation - photo');;
      console.log(flattenedData);
  
      const dialogRef = this.dialog.open(SummaryDialogComponent, {
        data: flattenedData
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const formDataToSubmit = new FormData();
          if (this.selectedFile) {
            formDataToSubmit.append('file', this.selectedFile, this.selectedFile.name);
          }
          Object.keys(this.teacherForm.value).forEach(groupKey => {
            const group = this.teacherForm.get(groupKey) as FormGroup;
            Object.keys(group.controls).forEach(key => {
              const value = group.get(key)?.value;
              formDataToSubmit.append(key, value);
            });
          });
  
          this.teacherService.createTeacher(formDataToSubmit).subscribe({
            next: (response) => {
              console.log('Teacher created:', response);
              this.onClearForm();
              this.showSuccessMessage('Teacher created successfully.');
            },
            error: (error) => {
              console.error('Error creating teacher:', error);
              this.showErrorMessage('Error creating teacher.');
            }
          });
        } else {
          console.warn('Form submission was cancelled.');
        }
      });
    } else {
      console.warn('The form is not valid or the file is not selected.');
      this.showErrorMessage('The form is not valid or the file is not selected.');
    }
  }
  

  onClearForm(): void {
    this.teacherForm.reset();
    this.selectedFile = null;
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
