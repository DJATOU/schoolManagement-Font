import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SessionService } from '../../../services/SessionService';
import { Attendance } from '../../../models/Attendance/attendance';
import { AttendanceService } from '../../../services/attendance.service';
import { Student } from '../../../models/student/student';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

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
    MatLabel,
    MatFormField,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatTab,
    MatTabGroup
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
    this.attendanceService.getAttendanceBySessionId(this.sessionData.id).subscribe(attendances => {
      this.sessionData.students.forEach((student: any) => {
        const attendance = attendances.find(a => a.studentId === student.id);
        if (attendance) {
          student.isPresent = attendance.isPresent;
          student.description = attendance.description;
        } else {
          student.isPresent = false;
          student.description = '';
        }
        student.disabled = true; // Désactiver la case à cocher
      });
    }, error => {
      console.error('Error fetching attendances:', error);
    });
  }

  onValidateSession() {
    const attendanceUpdates: Attendance[] = this.sessionData.students.map((student: Student) => ({
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
            alert(error.message); // Display the error message
        }
    });
  }

  markSessionAsFinished() {
    this.sessionService.markSessionAsFinished(this.sessionData.id).subscribe({
        next: (response) => {
            console.log('Session marked as finished', response);
            this.dialogRef.close({ isFinished: true }); // Close the dialog with the updated data
        },
        error: (error) => {
            console.error('Failed to mark session as finished', error);
            alert(error.message); // Display the error message
        }
    });
  }

  toggleAllStudents(isChecked: boolean) {
    this.sessionData.students.forEach((student: { isPresent: boolean; }) => student.isPresent = isChecked);
  }

  onCheckboxChange(student: { firstName: string; lastName: string; isPresent: boolean; }, event: { checked: any; }) {
    console.log(`Attendance for ${student.firstName} ${student.lastName}: ${event.checked}`);
    student.isPresent = event.checked;
  }
}
