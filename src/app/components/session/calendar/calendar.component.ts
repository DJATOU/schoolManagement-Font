import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { SessionService } from '../../../services/SessionService';
import { SessionModalComponent } from '../session-modal/session-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Group } from '../../../models/group/group';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [FullCalendarModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, SessionModalComponent, MatFormField, MatLabel, MatSelect, MatOption],
  standalone: true
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions | undefined;
  private eventsSubject = new Subject<{ groupId: number, startStr: string, endStr: string, successCallback: (events: EventInput[]) => void, failureCallback: (error: any) => void }>();
  groups: Group[] = [];
  selectedGroup = new FormControl<number | null>(null);

  constructor(private sessionService: SessionService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadGroups();
    this.eventsSubject.pipe(
      debounceTime(300)  // Debounce time to prevent too many API calls
    ).subscribe(({ groupId, startStr, endStr, successCallback, failureCallback }) => {
      this.loadEvents(groupId, startStr, endStr, successCallback, failureCallback);
    });

    this.selectedGroup.valueChanges.subscribe(groupId => {
      if (groupId !== null) {
        this.calendarOptions = {
          ...this.calendarOptions,
          events: (fetchInfo, successCallback, failureCallback) => {
            this.eventsSubject.next({ groupId, startStr: fetchInfo.startStr, endStr: fetchInfo.endStr, successCallback, failureCallback });
          }
        };
      }
    });

    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      buttonText: {
        listMonth: 'list'
      },
      events: (fetchInfo, successCallback, failureCallback) => {
        const groupId = this.selectedGroup.value;
        if (groupId !== null) {
          this.eventsSubject.next({ groupId, startStr: fetchInfo.startStr, endStr: fetchInfo.endStr, successCallback, failureCallback });
        }
      },
      eventClick: this.handleEventClick.bind(this),
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
    };
  }

  private loadGroups() {
    this.sessionService.getGroups().subscribe((groups: Group[]) => {
      this.groups = groups;
    });
  }

  private loadEvents(groupId: number, startStr: string, endStr: string, successCallback: (events: EventInput[]) => void, failureCallback: (error: any) => void) {
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    this.sessionService.getSessionsInDateRange(groupId, startDate, endDate).subscribe(sessions => {
      const events = sessions.map(session => ({
        title: session.title,
        start: new Date(session.sessionTimeStart),
        end: new Date(session.sessionTimeEnd),
        extendedProps: {
          id: session.id,
          groupName: session.groupName,
          roomName: session.roomName,
          teacherName: session.teacherName,
          feedbackLink: session.feedbackLink,
          sessionType: session.sessionType,
          groupId: session.groupId,
          isFinished: session.isFinished
        },
        classNames: session.isFinished ? ['is-finished'] : []
      }));
      successCallback(events);
    }, error => {
      failureCallback(error);
    });
  }

  handleEventClick(clickInfo: any) {
    console.log("Clicked event data:", clickInfo.event.extendedProps);

    if (!clickInfo.event.extendedProps.groupId) {
      console.error('Group ID is undefined for the clicked event', clickInfo.event.extendedProps);
      return;
    }

    this.sessionService.getStudentsByGroupId(clickInfo.event.extendedProps.groupId).subscribe({
      next: (students) => {
        const sessionData = {
          ...clickInfo.event.extendedProps,
          students: students.map(s => {
            return { ...s, id: s.id, isPresent: true };
          })
        };

        const dialogRef = this.dialog.open(SessionModalComponent, {
          data: sessionData,
          width: '600px',
          maxHeight: '90vh'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result && result.isFinished) {
            clickInfo.event.setProp('classNames', ['is-finished']);
            clickInfo.event.setExtendedProp('isFinished', true);
            console.log('Session validated and marked as finished on the calendar.');
          }
        });
      },
      error: (error) => {
        console.error('Error fetching students:', error);
      }
    });
  }
}