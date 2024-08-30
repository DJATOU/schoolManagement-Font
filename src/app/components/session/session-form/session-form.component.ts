import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from '../../../services/SessionService';
import { TeacherService } from '../../../services/teacher.service';
import { GroupService } from '../../../services/group.service';
import { RoomService } from '../../../services/room.service';
import { SeriesService } from '../../../services/series.service';
import { SummaryDialogComponent } from '../../summary-dialog/summary-dialog.component';
import { Teacher } from '../../../models/teacher/teacher';
import { Group } from '../../../models/group/group';
import { Room } from '../../../models/room/room';
import { SessionSeries } from '../../../models/sessionSerie/sessionSerie';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatTabsModule,
    MatSnackBarModule,
    CommonModule,
    MatCardModule,
    NgxMaterialTimepickerModule
  ],
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.scss'],
  providers: [SessionService]
})
export class SessionFormComponent implements OnInit {
  sessionForm!: FormGroup;
  teachers: Teacher[] = [];
  groups: Group[] = [];
  rooms: Room[] = [];
  series: SessionSeries[] = [];

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private teacherService: TeacherService,
    private groupService: GroupService,
    private roomService: RoomService,
    private seriesService: SeriesService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.sessionForm = this.fb.group({
      sessionDetails: this.fb.group({
        title: ['', Validators.required],
        description: [''],
        sessionType: ['', Validators.required],
        feedbackLink: ['']
      }),
      sessionTiming: this.fb.group({
        sessionDateStart: [null, Validators.required],
        sessionTimeStart: [null, Validators.required],
        sessionDateEnd: [null, Validators.required],
        sessionTimeEnd: [null, Validators.required],
      }),
      identifiers: this.fb.group({
        groupId: [null, Validators.required],
        roomId: [null, Validators.required],
        teacherId: [null, Validators.required]
      })
    });

    this.loadSelectOptions();
  }

  loadSelectOptions(): void {
    this.teacherService.getTeachers().subscribe(data => this.teachers = data);
    this.groupService.getGroups().subscribe(data => this.groups = data);
    this.roomService.getRooms().subscribe(data => this.rooms = data);
  }

  private combineDateTime(date: string, time: string): string {
    const [hourPart, minutePart] = time.match(/\d+/g) || [];
    const period = time.match(/AM|PM/i)?.[0];

    if (!hourPart || !minutePart || !period) {
      throw new Error('Invalid time input format');
    }

    const hours = parseInt(hourPart, 10);
    const minutes = parseInt(minutePart, 10);
    const dateTime = new Date(date);

    if (isNaN(dateTime.getTime())) {
      throw new Error('Invalid date format');
    }

    if (period.toUpperCase() === "PM" && hours !== 12) {
      dateTime.setHours(hours + 12, minutes, 0, 0);
    } else if (period.toUpperCase() === "AM" && hours === 12) {
      dateTime.setHours(0, minutes, 0, 0);
    } else {
      dateTime.setHours(hours, minutes, 0, 0);
    }

    return dateTime.toISOString();
  }

  onSubmit(): void {
    try {
      if (this.sessionForm.valid) {
        const formData = this.sessionForm.value;
        const startDateTime = this.combineDateTime(formData.sessionTiming.sessionDateStart, formData.sessionTiming.sessionTimeStart);
        const endDateTime = this.combineDateTime(formData.sessionTiming.sessionDateEnd, formData.sessionTiming.sessionTimeEnd);
  
        const submissionData = {
          ...formData.sessionDetails,
          ...formData.sessionTiming,
          sessionTimeStart: startDateTime,
          sessionTimeEnd: endDateTime,
          groupId: formData.identifiers.groupId,
          roomId: formData.identifiers.roomId,
          teacherId: formData.identifiers.teacherId,
        };
  
        console.log('Initial submissionData:', submissionData);
  
        const flattenedData = this.flattenFormData({
          sessionDetails: formData.sessionDetails,
          sessionTiming: formData.sessionTiming,
          identifiers: {
            group: this.getGroupNameById(formData.identifiers.groupId),
            room: this.getRoomNameById(formData.identifiers.roomId),
            teacher: this.getTeacherNameById(formData.identifiers.teacherId),
          }
        });
  
        const dialogRef = this.dialog.open(SummaryDialogComponent, {
          data: flattenedData
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('Dialog confirmed, proceeding with series creation or session submission.');
  
            this.groupService.getGroupById(submissionData.groupId).subscribe(group => {
              console.log('Group data:', group);
              const totalSessionsPerSeries = group.sessionNumberPerSerie;
  
              this.seriesService.getSessionSeriesByGroupId(submissionData.groupId).subscribe(series => {
                console.log('Existing series for group:', series);
                const currentSeries = series.find(s => s.groupId === submissionData.groupId);
  
                if (currentSeries && currentSeries.id !== undefined) {
                  console.log('Found existing series:', currentSeries);
  
                  this.sessionService.getSessionsBySeriesId(currentSeries.id).subscribe(sessions => {
                    console.log('Sessions in current series:', sessions);
  
                    if (sessions.length >= totalSessionsPerSeries) {
                      console.log('Series is full, creating a new series.');
                      const newSeriesData: SessionSeries = {
                        groupId: submissionData.groupId,
                        totalSessions: totalSessionsPerSeries,
                        sessionsCompleted: 0,
                        name: `Series ${currentSeries.groupId}-${series.length + 1}`, // Generate series name
                        serieTimeStart: new Date().toISOString(),
                        serieTimeEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
                      };
  
                      this.seriesService.createSeries(newSeriesData).subscribe(newSeries => {
                        console.log('New series created:', newSeries);
                        submissionData.seriesId = newSeries.id;
                        console.log('Updated submissionData with new series ID:', submissionData);
                        this.submitSession(submissionData);
                      });
                    } else {
                      console.log('Adding session to existing series.');
                      submissionData.seriesId = currentSeries.id!;
                      console.log('Updated submissionData with existing series ID:', submissionData);
                      this.submitSession(submissionData);
                    }
                  });
                } else {
                  console.log('No existing series found, creating a new one.');
                  const newSeriesData: SessionSeries = {
                    groupId: submissionData.groupId,
                    totalSessions: totalSessionsPerSeries,
                    sessionsCompleted: 0,
                    name: `Series ${submissionData.groupId}-1`,
                    serieTimeStart: new Date().toISOString(),
                    serieTimeEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
                  };
  
                  this.seriesService.createSeries(newSeriesData).subscribe(newSeries => {
                    console.log('New series created:', newSeries);
                    submissionData.seriesId = newSeries.id;
                    console.log('Updated submissionData with new series ID:', submissionData);
                    this.submitSession(submissionData);
                  });
                }
              });
            });
          } else {
            console.warn('Form submission was cancelled.');
          }
        });
      } else {
        console.warn('The form is not valid.');
        this.showErrorMessage('The form is not valid.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error in form submission:', error.message);
      } else {
        console.error('Error in form submission:', error);
      }
    }
  }
  
  private submitSession(submissionData: any): void {
    console.log('Submitting:', submissionData);
    this.sessionService.createSession(submissionData).subscribe({
      next: response => {
        console.log('Session created successfully:', response);
        this.sessionForm.reset();
        this.showSuccessMessage('Session created successfully.');
      },
      error: (error: unknown) => {
        if (error instanceof Error) {
          console.error('Failed to create session:', error.message);
        } else {
          console.error('Failed to create session:', error);
        }
        this.showErrorMessage('Failed to create session.');
      }
    });
  }
  
  getGroupNameById(id: number): string {
    const group = this.groups.find(g => g.id === id);
    return group ? group.name : '';
  }

  getRoomNameById(id: number): string {
    const room = this.rooms.find(r => r.id === id);
    return room ? room.name : '';
  }

  getTeacherNameById(id: number): string {
    const teacher = this.teachers.find(t => t.id === id);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : '';
  }

  flattenFormData(data: any, parentKey: string = ''): { label: string, value: any }[] {
    let result: { label: string, value: any }[] = [];
    Object.keys(data).forEach(key => {
      const newKey = parentKey ? `${parentKey} - ${key}` : key;
      const value = data[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result = result.concat(this.flattenFormData(value, newKey));
      } else if (Array.isArray(value)) {
        result.push({ label: newKey, value: value.join(', ') });
      } else {
        result.push({ label: newKey, value: value });
      }
    });
    return result;
  }

  onClearForm(): void {
    this.sessionForm.reset();
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
