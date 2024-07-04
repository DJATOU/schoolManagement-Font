import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOption, NativeDateAdapter } from '@angular/material/core';
import { StudentService } from '../../../services/student.service';
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { Level } from '../../../models/level/level';
import { LevelService } from '../../../services/level.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SummaryDialogComponent } from '../../summary-dialog/summary-dialog.component';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    RouterModule,
    MatStepperModule,
    MatIconModule,
    MatTabsModule,
    MatOption,
    MatSelectModule,
    CommonModule,
    MatDialogModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatSnackBarModule // Ajoutez ceci
  ],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
  providers: [
    StudentService,
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
export class StudentFormComponent implements OnInit {
  selectedFile: File | null = null;
  levels: Level[] = [];
  studentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private levelService: LevelService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar // Injectez MatSnackBar ici
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      personalInformation: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['', Validators.required],
        photo: ['']
      }),
      contactInformation: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [''],
        dateOfBirth: ['', Validators.required],
        placeOfBirth: ['']
      }),
      academicInformation: this.fb.group({
        levelId: ['', Validators.required],
        establishment: [''],
        averageScore: ['', Validators.pattern("^[0-9]*$")],
        description: ['']
      })
    });

    this.loadSelectOptions();
  }

  loadSelectOptions(): void {
    this.levelService.getLevels().subscribe(data => this.levels = data);
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
        // Recursively flatten the nested object
        result = result.concat(this.flattenFormData(value, newKey));
      } else if (Array.isArray(value)) {
        // Convert array to string
        result.push({ label: newKey, value: value.join(', ') });
      } else {
        result.push({ label: newKey, value: value });
      }
    });
    return result;
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formData = {
        personalInformation: this.studentForm.get('personalInformation')?.value,
        contactInformation: this.studentForm.get('contactInformation')?.value,
        academicInformation: this.studentForm.get('academicInformation')?.value,
        photo: this.selectedFile?.name
      };

      const flattenedData = this.flattenFormData(formData);
      console.log(flattenedData); // Debug: affiche les données aplaties

      const dialogRef = this.dialog.open(SummaryDialogComponent, {
        data: flattenedData
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Prepare form data for submission
          const formDataToSubmit = new FormData();
          if (this.selectedFile) {
            formDataToSubmit.append('file', this.selectedFile, this.selectedFile.name);
          }
          Object.keys(this.studentForm.value).forEach(groupKey => {
            const group = this.studentForm.get(groupKey) as FormGroup;
            Object.keys(group.controls).forEach(key => {
              const value = group.get(key)?.value;
              formDataToSubmit.append(key, value);
            });
          });

          // Submit the form data
          this.studentService.createStudent(formDataToSubmit).subscribe({
            next: (response) => {
              console.log('Student created:', response);
              this.onClearForm();
              this.showSuccessMessage('Student created successfully.'); // Affichez le message de succès
            },
            error: (error) => {
              console.error('Error creating student:', error);
              this.showErrorMessage('Error creating student.'); // Affichez le message d'erreur
            }
          });
        } else {
          console.warn('Form submission was cancelled.');
        }
      });
    } else {
      console.warn('The form is not valid or the file is not selected.');
      this.showErrorMessage('The form is not valid or the file is not selected.'); // Affichez le message d'erreur
    }
  }

  onClearForm(): void {
    this.studentForm.reset();
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
