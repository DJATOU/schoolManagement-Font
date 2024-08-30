import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SessionService } from '../../../../services/SessionService';
import { TeacherService } from '../../../../services/teacher.service';
import { GroupService } from '../../../../services/group.service';
import { RoomService } from '../../../../services/room.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { Session } from '../../../../models/session/session';
import { forkJoin } from 'rxjs';
import { Group } from '../../../../models/group/group';
import { Room } from '../../../../models/room/room';
import { Teacher } from '../../../../models/teacher/teacher';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-edit-session-dialog',
  templateUrl: './edit-session-dialog.component.html',
  styleUrls: ['./edit-session-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTabGroup,
    MatTab
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class EditSessionDialogComponent implements OnInit {
  sessionForm!: FormGroup;
  groups: Group[] = [];
  rooms: Room[] = [];
  teachers: Teacher[] = [];
  hours: string[] = [];
  minutes: string[] = [];
  periods: string[] = ['AM', 'PM'];

  constructor(
    public dialogRef: MatDialogRef<EditSessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { session: Session },
    private fb: FormBuilder,
    private sessionService: SessionService,
    private groupService: GroupService,
    private roomService: RoomService,
    private teacherService: TeacherService,
    private overlayContainer: OverlayContainer  // OverlayContainer for managing overlays
  ) {
    // Initialize hour and minute options
    this.hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')); // 01-12
    this.minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')); // 00-59
  }

  ngOnInit(): void {
    // Set a custom class on the overlay container to handle high z-index issues
    this.overlayContainer.getContainerElement().classList.add('custom-timepicker-overlay');

    const { groupId, roomId, teacherId } = this.data.session;
    const sessionTimeStart = new Date(this.data.session.sessionTimeStart);
    const sessionTimeEnd = new Date(this.data.session.sessionTimeEnd);

    this.sessionForm = this.fb.group({
      sessionDetails: this.fb.group({
        title: [this.data.session.title],
        description: [this.data.session.description],
        sessionType: [this.data.session.sessionType],
        feedbackLink: [this.data.session.feedbackLink]
      }),
      sessionTiming: this.fb.group({
        sessionDateStart: [this.formatDateToLocal(sessionTimeStart)],
        startHour: [this.formatHour(sessionTimeStart.getHours())],
        startMinute: [this.formatMinute(sessionTimeStart.getMinutes())],
        startPeriod: [this.getPeriod(sessionTimeStart.getHours())],
        sessionDateEnd: [this.formatDateToLocal(sessionTimeEnd)],
        endHour: [this.formatHour(sessionTimeEnd.getHours())],
        endMinute: [this.formatMinute(sessionTimeEnd.getMinutes())],
        endPeriod: [this.getPeriod(sessionTimeEnd.getHours())]
      }),
      identifiers: this.fb.group({
        groupId: [groupId],
        roomId: [roomId],
        teacherId: [teacherId]
      })
    });

    if (groupId && roomId && teacherId) {
      forkJoin([
        this.groupService.getGroups(),
        this.roomService.getRooms(),
        this.teacherService.getTeachers()
      ]).subscribe(([groups, rooms, teachers]) => {
        this.groups = groups;
        this.rooms = rooms;
        this.teachers = teachers;
      }, error => {
        console.error('Error fetching related entities:', error);
      });
    } else {
      console.error('Missing IDs in session data:', { groupId, roomId, teacherId });
    }
  }

  formatHour(hour: number): string {
    return ((hour % 12) || 12).toString().padStart(2, '0');
  }

  formatMinute(minute: number): string {
    return minute.toString().padStart(2, '0');
  }

  getPeriod(hour: number): string {
    return hour >= 12 ? 'PM' : 'AM';
  }

  onSave(): void {
    if (this.sessionForm.valid) {
      const formValues = this.sessionForm.value;

      // Log the form values for debugging
      console.log('Form Values:', formValues);

      const startHour24 = this.convertTo24Hour(formValues.sessionTiming.startHour, formValues.sessionTiming.startPeriod);
      const endHour24 = this.convertTo24Hour(formValues.sessionTiming.endHour, formValues.sessionTiming.endPeriod);

      const sessionStartDateTime = new Date(formValues.sessionTiming.sessionDateStart);
      sessionStartDateTime.setHours(startHour24, +formValues.sessionTiming.startMinute);

      // Log the calculated session start date and time
      console.log('Session Start DateTime:', sessionStartDateTime);

      const sessionEndDateTime = new Date(formValues.sessionTiming.sessionDateEnd);
      sessionEndDateTime.setHours(endHour24, +formValues.sessionTiming.endMinute);

      // Log the calculated session end date and time
      console.log('Session End DateTime:', sessionEndDateTime);

      const updatedSession: Session = {
        ...this.data.session,
        title: formValues.sessionDetails.title,
        description: formValues.sessionDetails.description,
        sessionType: formValues.sessionDetails.sessionType,
        feedbackLink: formValues.sessionDetails.feedbackLink,
        sessionTimeStart: sessionStartDateTime,
        sessionTimeEnd: sessionEndDateTime,
        groupId: formValues.identifiers.groupId,
        groupName: this.getGroupNameById(formValues.identifiers.groupId),
        roomName: this.getRoomNameById(formValues.identifiers.roomId),
        teacherName: this.getTeacherNameById(formValues.identifiers.teacherId),
        roomId: formValues.identifiers.roomId,
        teacherId: formValues.identifiers.teacherId,
        date_update: new Date(),
      };

      // Log the final session object being sent to the service
      console.log('Updated Session:', updatedSession);

      this.sessionService.updateSession(updatedSession.id, updatedSession).subscribe({
        next: () => {
          console.log('Session successfully updated.');
          this.dialogRef.close(updatedSession);
        },
        error: (error) => {
          console.error('Error updating session:', error);
        }
      });
    } else {
      console.warn('Form is not valid.');
    }
  }

  private convertTo24Hour(hour: string, period: string): number {
    let hourNumber = +hour;
    if (period === 'PM' && hourNumber < 12) {
      hourNumber += 12;
    } else if (period === 'AM' && hourNumber === 12) {
      hourNumber = 0;
    }
    return hourNumber;
  }

  private formatDateToLocal(date: Date): string {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().split('T')[0];
  }

  private getGroupNameById(id: number): string {
    const group = this.groups.find(g => g.id === id);
    return group ? group.name : '';
  }

  private getRoomNameById(id: number): string {
    const room = this.rooms.find(r => r.id === id);
    return room ? room.name : '';
  }

  private getTeacherNameById(id: number): string {
    const teacher = this.teachers.find(t => t.id === id);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : '';
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
