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
          id: session.id,
          groupName: session.groupName,
          roomName: session.roomName,
          teacherName: session.teacherName,
          feedbackLink: session.feedbackLink,
          sessionType: session.sessionType,
          start: new Date(session.sessionTimeStart),
          end: new Date(session.sessionTimeEnd),
          groupId: session.groupId,
          isFinished: session.isFinished
        },
        classNames: session.isFinished ? ['is-finished'] : []
      }));
    });
  }

  
  handleEventClick(clickInfo: any) {
    console.log("Clicked event data:", clickInfo.event.extendedProps);

    if (!clickInfo.event.extendedProps.groupId) {
      console.error('Group ID is undefined for the clicked event', clickInfo.event.extendedProps);
      return; // Exit the function or handle this case appropriately
    }

    // Fetch students based on group ID
    this.sessionService.getStudentsByGroupId(clickInfo.event.extendedProps.groupId).subscribe({
      next: (students) => {
        const sessionData = {
          ...clickInfo.event.extendedProps,
          students: students.map(s => {
            return { ...s, id: s.id, isPresent: true };  // Ensure 'id' is correctly mapped
          })
        };

        // Open the dialog with custom dimensions
        const dialogRef = this.dialog.open(SessionModalComponent, {
          data: sessionData,
          width: '600px',
          maxHeight: '90vh'
        });

        // Handling after the dialog is closed
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.isFinished) {
            // Change the background color of the session
            clickInfo.event.setProp('backgroundColor', 'linear-gradient(98.3deg, rgb(0, 0, 0) 10.6%, rgb(255, 0, 0) 97.7%)');
            clickInfo.event.setExtendedProp('isFinished', true);
            console.log('Session validated and marked as finished on the calendar.');
          }
        });
      },
      error: (error) => {
        console.error('Error fetching students:', error);
        // Optionally show an error message or user notification here
      }
    });
}


  
  
  
  
}
