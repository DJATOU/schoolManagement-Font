import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Student } from '../domain/student';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LevelService } from '../../../services/level.service';
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
  ],
  templateUrl: './edit-student-dialog.component.html',
  styleUrls: ['./edit-student-dialog.component.scss']
})
export class EditStudentDialogComponent implements OnInit {
  editStudentForm!: FormGroup;
  levels: Level[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { student: Student },
    private fb: FormBuilder,
    private levelService: LevelService
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

    const updatedStudent: Student = { ...this.data.student };

    (Object.keys(formValues) as Array<keyof Student>).forEach((key) => {
      const value = formValues[key];
      if (value !== undefined) {
        (updatedStudent as any)[key] = value;
      }
    });

    console.log('Updated student:', updatedStudent);
    this.dialogRef.close(updatedStudent);
  }
}
