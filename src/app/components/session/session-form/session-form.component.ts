import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import { TeacherService } from '../../../services/teacher.service';
import { GroupService } from '../../../services/group.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SeriesService } from '../../../services/series.service';
import { Teacher } from '../../../models/teacher/teacher';
import { Group } from '../../../models/group/group';
import { Room } from '../../../models/room/room';
import { SessionSeries } from '../../../models/sessionSerie/sessionSerie';
import { SessionService } from '../../../services/SessionService';
import { RoomService } from '../../../services/room.service';
import { Session } from '../../../models/session/session';
@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatIconModule,
    HttpClientModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    CommonModule
  ],
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.scss']
})
export class SessionFormComponent implements OnInit {
  sessionForm!: FormGroup;
  teachers: Teacher[] = [];
  groups: Group[] = [];
  rooms: Room[] = [];
  series: SessionSeries[] = [];
  sessions: Session[] = [];

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private teacherService: TeacherService,
    private groupService: GroupService,
    private roomService: RoomService,
    private seriesService: SeriesService
  ) {}

  ngOnInit(): void {
    this.sessionForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      sessionType: ['', Validators.required],
      feedbackLink: [''],
      sessionDateStart: [null, Validators.required],
      sessionTimeStart: [null, Validators.required],
      sessionDateEnd: [null, Validators.required],
      sessionTimeEnd: [null, Validators.required],
      groupId: [null, Validators.required],
      roomId: [null, Validators.required],
      teacherId: [null, Validators.required],
      seriesId: [null]
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
        const startDateTime = this.combineDateTime(formData.sessionDateStart, formData.sessionTimeStart);
        const endDateTime = this.combineDateTime(formData.sessionDateEnd, formData.sessionTimeEnd);

        const submissionData = {
          ...formData,
          sessionTimeStart: startDateTime,
          sessionTimeEnd: endDateTime
        };

        // Récupérer les détails du groupe pour obtenir le nombre total de sessions par série
        this.groupService.getGroupById(submissionData.groupId).subscribe(group => {
          const totalSessionsPerSeries = group.sessionNumberPerSerie;

          this.seriesService.getSeriesByGroupId(submissionData.groupId).subscribe(series => {
            const currentSeries = series.find(s => s.groupId === submissionData.groupId);

            if (currentSeries && currentSeries.id !== undefined) {
              this.sessionService.getSessionsBySeriesId(currentSeries.id).subscribe(sessions => {
                if (sessions.length >= totalSessionsPerSeries) {
                  const newSeriesData: SessionSeries = {
                    groupId: submissionData.groupId,
                    totalSessions: totalSessionsPerSeries,
                    sessionsCompleted: 0,
                    name: `Series ${currentSeries.groupId}-${series.length + 1}`, // Generate series name
                    serieTimeStart: new Date().toISOString(),
                    serieTimeEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
                  };

                  this.seriesService.createSeries(newSeriesData).subscribe(newSeries => {
                    submissionData.seriesId = newSeries.id;
                    this.submitSession(submissionData);
                  });
                } else {
                  submissionData.seriesId = currentSeries.id!;
                  this.submitSession(submissionData);
                }
              });
            } else {
              const newSeriesData: SessionSeries = {
                groupId: submissionData.groupId,
                totalSessions: totalSessionsPerSeries,
                sessionsCompleted: 0,
                name: `Series ${submissionData.groupId}-1`,
                serieTimeStart: new Date().toISOString(),
                serieTimeEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
              };

              this.seriesService.createSeries(newSeriesData).subscribe(newSeries => {
                submissionData.seriesId = newSeries.id;
                this.submitSession(submissionData);
              });
            }
          });
        });
      } else {
        console.warn('Form is not valid.');
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
      },
      error: (error: unknown) => {
        if (error instanceof Error) {
          console.error('Failed to create session:', error.message);
        } else {
          console.error('Failed to create session:', error);
        }
      }
    });
  }

  onClearForm(): void {
    this.sessionForm.reset();
  }
}