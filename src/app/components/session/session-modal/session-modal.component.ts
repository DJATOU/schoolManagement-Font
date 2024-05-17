import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SessionService } from '../../../services/SessionService';
import { AttendanceService } from '../../../services/attendance.service';
import { Student } from '../../../models/student/student';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-session-modal',
  templateUrl: './session-modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatTabsModule,
  ]
})
export class SessionModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SessionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public sessionData: any,
    private sessionService: SessionService,
    private attendanceService: AttendanceService 
  ) {}

  ngOnInit() {
    if (!this.sessionData.students) {
      this.sessionService.getStudentsByGroupId(this.sessionData.groupId).subscribe(students => {
        this.sessionData.students = students.map(s => ({
          ...s,
          isPresent: s.isPresent ?? true,
          description: s.description ?? ''
        }));
      }, error => {
        console.error('Error fetching students:', error);
      });
    }
  }

  onValidateSession() {
    const attendanceUpdates = this.sessionData.students.map((student: Student) => ({
      studentId: student.id,
      sessionId: this.sessionData.id,
      groupId: this.sessionData.groupId,
      isPresent: student.isPresent !== undefined ? student.isPresent : true,
      description: student.description
    }));

    this.attendanceService.submitAttendance(attendanceUpdates).subscribe({
      next: (response) => {
        console.log('Attendance submitted successfully', response);
        this.markSessionAsFinished();
      },
      error: (error) => {
        console.error('Failed to submit attendance', error);
        alert(error.message);
      }
    });
  }

  markSessionAsFinished() {
    this.sessionService.markSessionAsFinished(this.sessionData.id).subscribe({
      next: (response) => {
        console.log('Session marked as finished', response);
        this.dialogRef.close({ isFinished: true });
      },
      error: (error) => {
        console.error('Failed to mark session as finished', error);
        alert(error.message);
      }
    });
  }

  toggleAllStudents(isChecked: boolean) {
    this.sessionData.students.forEach((student: { isPresent: boolean }) => student.isPresent = isChecked);
  }
}
