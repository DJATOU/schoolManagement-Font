import { Component, Inject, OnInit } from '@angular/core';
import { Attendance } from '../../../models/Attendance/attendance';
import { Group } from '../../../models/group/group';
import { SessionSeries } from '../../../models/sessionSerie/sessionSerie';
import { AttendanceService } from '../../../services/attendance.service';
import { SeriesService } from '../../../services/series.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StudentService } from '../../../services/student.service';
import { SessionService } from '../../../services/SessionService';

@Component({
  selector: 'app-attendance-history-dialog',
  standalone: true,
  templateUrl: './attendance-history-dialog.component.html',
  styleUrls: ['./attendance-history-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule
  ]
})
export class AttendanceHistoryDialogComponent implements OnInit {
  studentGroups: Group[] = [];
  sessionSeries: SessionSeries[] = [];
  attendanceHistory: MatTableDataSource<Attendance> = new MatTableDataSource<Attendance>();

  selectedGroup: number | null = null;
  selectedSeries: number | null = null;

  displayedColumns: string[] = ['session', 'attendanceDate', 'isPresent', 'isJustified', 'description'];

  constructor(
    private attendanceService: AttendanceService,
    private studentService: StudentService,
    private seriesService: SeriesService,
    private sessionService: SessionService,
    public dialogRef: MatDialogRef<AttendanceHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { studentId: number }
  ) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.studentService.getGroupsForStudent(this.data.studentId).subscribe({
      next: (groups) => {
        this.studentGroups = groups;
      },
      error: (error) => {
        console.error('Error loading groups:', error);
      }
    });
  }

  loadSessionSeries(): void {
    if (this.selectedGroup) {
      this.seriesService.getSessionSeriesByGroupId(this.selectedGroup).subscribe({
        next: (series) => {
          this.sessionSeries = series;
          this.selectedSeries = null;
          this.attendanceHistory.data = [];
        },
        error: (error) => {
          console.error('Error loading session series:', error);
        }
      });
    }
  }

  loadAttendanceHistory(): void {
    if (this.selectedSeries && this.selectedGroup) {
      console.log('Loading attendance history for student ID:', this.data.studentId, 'and series ID:', this.selectedSeries);
      this.attendanceService.getAttendanceByStudentAndSeries(this.data.studentId, this.selectedSeries).subscribe({
        next: (attendanceRecords) => {
          console.log('Attendance records retrieved:', attendanceRecords);
  
          // Pour chaque enregistrement de présence, récupérer les détails de la session
          const sessionRequests = attendanceRecords.map(attendance => 
            this.sessionService.getSessionById(attendance.sessionId).toPromise()
          );
  
          Promise.all(sessionRequests).then(sessions => {
            this.attendanceHistory.data = attendanceRecords.map((attendance, index) => {
              const session = sessions[index];
              return {
                ...attendance,
                sessionName: session?.title || 'Session inconnue', // Récupérer le nom de la session ou une valeur par défaut
                sessionDate: session?.sessionTimeStart || null // Récupérer la date de la session ou null
              };
            });
          }).catch(error => {
            console.error('Error loading session data:', error);
          });
        },
        error: (error: Error) => {
          console.error('Error loading attendance history:', error);
        }
      });
    } else {
      console.error('Selected series or group is null or undefined.');
    }
  }
  
  getRowClass(attendance: Attendance): string {
    if (attendance.isPresent) {
      return 'row-present';
    } else if (attendance.isJustified) {
      return 'row-justified';
    } else {
      return 'row-not-justified';
    }
  }
  
  
}
