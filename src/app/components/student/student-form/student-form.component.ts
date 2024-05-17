import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOption, NativeDateAdapter } from '@angular/material/core';
import { StudentService } from '../../../services/student.service';
import { RouterModule } from '@angular/router';
import { MatStepperModule} from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { Level } from '../../../models/level/level';
import { LevelService } from '../../../services/level.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SummaryDialogComponent } from '../../summary-dialog/summary-dialog.component';


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
    MatDialogModule
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
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      dateOfBirth: ['', Validators.required],
      placeOfBirth: [''],
      levelId: [null, Validators.required],
      groupIds: [''], // Assurez-vous de gérer ce champ correctement côté backend si c'est un tableau
      tutorId: [''],
      establishment: [''],
      averageScore: ['']
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

  onSubmit(): void {
    if (this.studentForm.valid) {
      const dialogRef = this.dialog.open(SummaryDialogComponent, {
        data: { ...this.studentForm.value, photo: this.selectedFile?.name }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Prepare form data for submission
          const formData = new FormData();
          if (this.selectedFile) {
            formData.append('file', this.selectedFile, this.selectedFile.name);
          }
          Object.keys(this.studentForm.value).forEach(key => {
            const value = this.studentForm.get(key)?.value;
            formData.append(key, value);
          });
  
          // Submit the form data
          this.studentService.createStudent(formData).subscribe({
            next: (response) => {
              console.log('Student created:', response);
              this.onClearForm();
            },
            error: (error) => {
              console.error('Error creating student:', error);
            }
          });
        } else {
          console.warn('Form submission was cancelled.');
        }
      });
    } else {
      console.warn('The form is not valid or the file is not selected.');
    }
  }

  onClearForm(): void {
    this.studentForm.reset();
    this.selectedFile = null;
  }
}
