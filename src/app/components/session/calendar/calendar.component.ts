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


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  imports: [FullCalendarModule,  MatDialogModule,MatButtonModule, SessionModalComponent], // Include MatDialog and SessionModalComponent here
  standalone: true
})
export class CalendarComponent implements OnInit {
  calendarOptions: any;

  constructor(private sessionService: SessionService, public dialog: MatDialog) {}

  ngOnInit() {
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
      events: [],
      eventClick: this.handleEventClick.bind(this), // Setup the click handler
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
    };

    this.sessionService.getAllSessionsWithDetail().subscribe(sessions => {
      this.calendarOptions.events = sessions.map(session => ({
        title: session.title,
        start: new Date(session.sessionTimeStart),
        end: new Date(session.sessionTimeEnd),
        extendedProps: {
         
        id: session.id, // Ensure 'id' is explicitly included if not already part of session
        groupName: session.groupName,
        roomName: session.roomName,
        teacherName: session.teacherName,
        feedbackLink: session.feedbackLink,
        sessionType: session.sessionType,
        start: new Date(session.sessionTimeStart),
        end: new Date(session.sessionTimeEnd),
        //isFinished: session.isFinished,
        title: session.title // Duplicate here for consistency
        }
      }));
    });
    console.log("Event data after mapping:", this.calendarOptions.events);
  }

  handleEventClick(clickInfo: any) {
    console.log("Event data:", clickInfo.event.extendedProps);
    if (clickInfo.event.extendedProps.id) {
      const dialogRef = this.dialog.open(SessionModalComponent, {
        data: clickInfo.event.extendedProps
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.isFinished) {
          clickInfo.event.setProp('backgroundColor', 'red');
          clickInfo.event.setExtendedProp('isFinished', true);
        }
      });
    } else {
      console.error('No session ID provided for the event');
    }
  }
  
}
