import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Teacher } from '../../../models/teacher/teacher';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-edit-teacher-dialog',
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
  templateUrl: './edit-teacher-dialog.component.html',
  styleUrls: ['./edit-teacher-dialog.component.scss']
})
export class EditTeacherDialogComponent implements OnInit {
  editTeacherForm!: FormGroup;
  selectedFile: File | null = null;
  photoPreview: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditTeacherDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { teacher: Teacher },
    private fb: FormBuilder,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    // Convertir dateOfBirth en objet Date si c'est une chaîne
    let dateOfBirth: Date | null = null;
    if (this.data.teacher.dateOfBirth) {
      dateOfBirth = new Date(this.data.teacher.dateOfBirth);
    }

    this.editTeacherForm = this.fb.group({
      firstName: [this.data.teacher.firstName],
      lastName: [this.data.teacher.lastName],
      email: [this.data.teacher.email],
      phoneNumber: [this.data.teacher.phoneNumber],
      dateOfBirth: [dateOfBirth],
      placeOfBirth: [this.data.teacher.placeOfBirth],
      gender: [this.data.teacher.gender],
      specialization: [this.data.teacher.specialization],
      qualifications: [this.data.teacher.qualifications],
      yearsOfExperience: [this.data.teacher.yearsOfExperience],
      communicationPreference: [this.data.teacher.communicationPreference]
    });

    // Afficher photo actuelle si elle existe
    if (this.data.teacher.photo) {
      this.photoPreview = this.teacherService.getTeacherPhotoUrl(this.data.teacher.id!);
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

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const formValues = this.editTeacherForm.value;

    // Convertir dateOfBirth en format ISO string si c'est un objet Date
    if (formValues.dateOfBirth instanceof Date) {
      formValues.dateOfBirth = formValues.dateOfBirth.toISOString();
    }

    const updatedTeacher: Teacher = {
      ...this.data.teacher,
      ...formValues,
      groups: [] // Ne pas envoyer les groups au backend lors de la mise à jour
    };

    console.log('Updated teacher:', updatedTeacher);
    this.dialogRef.close({ teacher: updatedTeacher, file: this.selectedFile });
  }
}
