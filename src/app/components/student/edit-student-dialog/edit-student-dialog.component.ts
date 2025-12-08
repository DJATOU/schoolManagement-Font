import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Student } from '../domain/student';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { LevelService } from '../../../services/level.service';
import { StudentService } from '../services/student.service';
import { Level } from '../../../models/level/level';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-student-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './edit-student-dialog.component.html',
  styleUrls: ['./edit-student-dialog.component.scss']
})
export class EditStudentDialogComponent implements OnInit {
  editStudentForm!: FormGroup;
  levels: Level[] = [];
  selectedFile: File | null = null;
  photoPreview: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { student: Student },
    private fb: FormBuilder,
    private levelService: LevelService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    // Convertir dateOfBirth en objet Date si c'est une chaîne de caractères
    let dateOfBirth: Date | null = null;
    if (this.data.student.dateOfBirth) {
      dateOfBirth = new Date(this.data.student.dateOfBirth);
    }

    this.editStudentForm = this.fb.group({
      firstName: [this.data.student.firstName],
      lastName: [this.data.student.lastName],
      email: [this.data.student.email],
      phoneNumber: [this.data.student.phoneNumber],
      dateOfBirth: [dateOfBirth],
      placeOfBirth: [this.data.student.placeOfBirth],
      gender: [this.data.student.gender],
      levelId: [this.data.student.levelId],
      establishment: [this.data.student.establishment],
      averageScore: [this.data.student.averageScore],
    });

    this.loadLevels();

    // Afficher photo actuelle si elle existe
    if (this.data.student.photo) {
      this.photoPreview = this.studentService.getStudentPhotoUrl(this.data.student.id!);
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target?.files?.length) {
      this.selectedFile = target.files[0];

      // Preview de la nouvelle photo
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  loadLevels(): void {
    this.levelService.getLevels().subscribe({
      next: (levels) => {
        this.levels = levels;
      },
      error: (error) => {
        console.error('Error loading levels:', error);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const formValues: Partial<Student> = this.editStudentForm.value;

    // Convertir dateOfBirth en format ISO string si c'est un objet Date
    if (formValues.dateOfBirth instanceof Date) {
      formValues.dateOfBirth = formValues.dateOfBirth.toISOString() as any;
    }

    const updatedStudent: Student = { ...this.data.student };

    (Object.keys(formValues) as Array<keyof Student>).forEach((key) => {
      const value = formValues[key];
      if (value !== undefined) {
        (updatedStudent as any)[key] = value;
      }
    });

    console.log('Updated student:', updatedStudent);
    this.dialogRef.close({ student: updatedStudent, file: this.selectedFile });
  }
}
