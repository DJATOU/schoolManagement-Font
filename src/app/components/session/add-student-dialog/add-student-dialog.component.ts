import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentService } from '../../student/services/student.service';
import { Student } from '../../student/domain/student';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-student-dialog',
  templateUrl: './add-student-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ]
})
export class AddStudentDialogComponent implements OnInit {
  students: Student[] = [];
  selectedStudent: Student | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { levelId: number, existingStudentIds: number[] }, // Update here
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getStudentsByLevel(this.data.levelId).subscribe({ // Update here
      next: (students) => {
        // Filtrer les étudiants déjà présents
        this.students = students.filter(student => !this.data.existingStudentIds.includes(student.id!));
      },
      error: (error) => {
        console.error('Failed to load students:', error);
      }
    });
  }

  onConfirm(): void {
    if (this.selectedStudent) {
      this.dialogRef.close(this.selectedStudent);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
