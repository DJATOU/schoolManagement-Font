import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SessionService } from '../../../services/SessionService';
import { AttendanceService } from '../../../services/attendance.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Attendance } from '../../../models/Attendance/attendance';
import { Session } from '../../../models/session/session';
import { Student } from '../../../models/student/student';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { AddStudentDialogComponent } from '../add-student-dialog/add-student-dialog.component';
import { StudentService } from '../../../services/student.service';
import { EditSessionDialogComponent } from '../edit/edit-session-dialog/edit-session-dialogue.component';
import { GroupService } from '../../../services/group.service';

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
    MatIcon
  ]
})
export class SessionModalComponent implements OnInit {
  isFinished = false;

  constructor(
    public dialogRef: MatDialogRef<SessionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public sessionData: Session & { students: Student[] },
    private sessionService: SessionService,
    private attendanceService: AttendanceService,
    private studentService : StudentService,
    private groupService :  GroupService,
    private dialog: MatDialog // Injection de MatDialog ici
  ) {}

  ngOnInit(): void {
   // this.loadStudentsData();
    this.loadAttendanceData();
    this.isFinished = !!this.sessionData.isFinished; // Convertir en booléen si la valeur est définie

    // Log supplémentaire pour vérifier les données de session
    console.log('Session Data on Init SessionModalComponent:', this.sessionData);

    if (this.sessionData.roomId === null || this.sessionData.teacherId === null) {
      console.error('room_id or teacher_id is null in the initial session data.');
    }
  }

  private loadStudentsData(): void {
    if (!this.sessionData.students || this.sessionData.students.length === 0) {
      this.sessionService.getStudentsByGroupId(this.sessionData.groupId).subscribe({
        next: (students: Student[]) => {
          this.sessionData.students = students
            .filter(student => student.id !== undefined) // Filtrez les étudiants sans 'id'
            .map((student) => ({
              ...student,
              id: student.id as number, // Force l'assignation en tant que 'number'
              isPresent: student.isPresent ?? true,
              description: student.description ?? '',
            }));
        },
        error: (error) => {
          console.error('Error fetching students:', error);
        }
      });
    }
  }

  private loadAttendanceData(): void {
    this.attendanceService.getAttendanceBySessionId(this.sessionData.id).subscribe({
      next: (attendances: Attendance[]) => {
        attendances.forEach((attendance) => {
          const existingStudent = this.sessionData.students.find((s: Student) => s.id === attendance.studentId);
  
          if (existingStudent) {
            // Mettre à jour les informations de l'étudiant existant
            existingStudent.isPresent = attendance.isPresent;
            existingStudent.description = attendance.description ?? '';
          } else {
            // Obtenir les vraies informations de l'étudiant depuis le service si l'étudiant n'existe pas encore
            this.studentService.getStudentById(attendance.studentId).subscribe((student: Student) => {
              this.sessionData.students.push({
                ...student,
                isPresent: attendance.isPresent,
                description: attendance.description ?? ''
              });
            });
          }
        });
      },
      error: (error) => {
        console.error('Error fetching attendance:', error);
      }
    });
  }
  

  onValidateSession(): void {
    console.log('Validating session with Series ID:', this.sessionData.sessionSeriesId);

    // Construire la liste des présences
    const attendanceUpdates: Attendance[] = this.sessionData.students.map((student: Student) => ({
        id: 0, // Initialement zéro car ce sera géré par le backend
        studentId: student.id!,
        sessionId: this.sessionData.id,
        groupId: this.sessionData.groupId,
        sessionSeriesId: this.sessionData.sessionSeriesId,
        isPresent: student.isPresent !== undefined ? student.isPresent : true,
        isJustified: student.isJustified !== undefined ? student.isJustified : false,
        description: student.description ?? '',
        dateCreation: new Date(),
        dateUpdate: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
        active: true
    }));

    this.attendanceService.submitAttendance(attendanceUpdates).subscribe({
        next: (response) => {
            console.log('Attendance submitted successfully', response);
            this.markSessionAsFinished();

            // Recharger la liste des présences après validation pour éviter la duplication
            this.loadAttendanceData();
        },
        error: (error) => {
            console.error('Failed to submit attendance', error);
            alert('Failed to submit attendance: ' + error.message);
        }
    });
}

  
  

  private markSessionAsFinished(): void {
    this.sessionService.markSessionAsFinished(this.sessionData.id).subscribe({
      next: (response) => {
        console.log('Session marked as finished', response);
        this.isFinished = true;
        this.dialogRef.close({ isFinished: true });
      },
      error: (error) => {
        console.error('Failed to mark session as finished', error);
        alert(error.message);
      }
    });
  }

  toggleAllStudents(isChecked: boolean): void {
    if (this.isFinished) return; // Prevent changing if session is finished
    this.sessionData.students.forEach((student) => student.isPresent = isChecked);
  }

  onUnvalidateSession(): void {
    this.sessionService.markSessionAsUnfinished(this.sessionData.id).subscribe({
        next: () => {
            this.attendanceService.deactivateAttendanceBySessionId(this.sessionData.id).subscribe({
                next: () => {
                    console.log('Session unvalidated and attendance deactivated successfully');
                    this.isFinished = false;

                    // Mettre à jour uniquement le champ `isPresent` pour refléter la dévalidation
                    this.sessionData.students.forEach(student => {
                        student.isPresent = false;
                    });

                    // Log pour vérifier les données des étudiants après mise à jour
                    console.log('Updated student data after unvalidation:', this.sessionData.students);
                },
                error: (error) => {
                    console.error('Failed to deactivate attendance:', error);
                    alert('Failed to deactivate attendance: ' + error.message);
                }
            });
        },
        error: (error) => {
            console.error('Failed to unvalidate session:', error);
            alert('Failed to unvalidate session: ' + error.message);
        }
    });
}


openAddStudentDialog(): void {
  const existingStudentIds = this.sessionData.students.map(student => student.id);

  // Récupérer le levelId avant d'ouvrir le dialog
  this.groupService.getLevelIdByGroupId(this.sessionData.groupId).subscribe({
    next: (levelId) => {
      if (levelId !== undefined) {
        const dialogRef = this.dialog.open(AddStudentDialogComponent, {
          width: '400px',
          data: { 
            groupId: this.sessionData.groupId, 
            levelId: levelId,  // Utilisation de levelId récupéré
            existingStudentIds: existingStudentIds
          }
        });

        dialogRef.afterClosed().subscribe((selectedStudent: Student | null) => {
          if (selectedStudent) {
            this.sessionData.students.push({
              ...selectedStudent,
              isPresent: true,
              description: ''
            });
          }
        });
      } else {
        console.error('Level ID is undefined for group ID:', this.sessionData.groupId);
      }
    },
    error: (error) => {
      console.error('Failed to fetch level ID:', error);
    }
  });
}


  onEditSession(): void {
    const editSessionData: Session = {
      id: this.sessionData.id,
      title: this.sessionData.title,
      sessionType: this.sessionData.sessionType,
      groupId: this.sessionData.groupId,
      roomId: this.sessionData.roomId ?? null,  // Assurez-vous que la valeur est bien assignée
      teacherId: this.sessionData.teacherId ?? null,  // Assurez-vous que la valeur est bien assignée
      groupName: this.sessionData.groupName ?? '',
      roomName: this.sessionData.roomName ?? '',
      teacherName: this.sessionData.teacherName ?? '',
      sessionTimeStart: this.sessionData.sessionTimeStart,
      sessionTimeEnd: this.sessionData.sessionTimeEnd,
      feedbackLink: this.sessionData.feedbackLink,
      students: this.sessionData.students
    };
  
    console.log('Edit Session Data:', editSessionData);
  
    const dialogRef = this.dialog.open(EditSessionDialogComponent, {
       backdropClass: '',
       panelClass: 'custom-dialog-container',
      width: '700px',
      data: { session: editSessionData }
    });
  
    dialogRef.afterClosed().subscribe((updatedSession: Session | null) => {
      if (updatedSession) {
        Object.assign(this.sessionData, updatedSession);
      }
    });
  }

  onPresentChange(student: Student): void {
    if (student.isPresent) {
        student.isJustified = false;  // Désélectionne isJustified si isPresent est coché
    }
}

  onJustifiedChange(student: Student): void {
    if (student.isJustified) {
        student.isPresent = false;  // Désélectionne isPresent si isJustified est coché
    }
}

}
