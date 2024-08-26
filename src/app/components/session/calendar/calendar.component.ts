import { Component, OnInit, ViewChild, NgZone, Injector, ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { SessionService } from '../../../services/SessionService';
import { SessionModalComponent } from '../session-modal/session-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { GroupSelectorComponent } from '../../group/group-selector/group-selector.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    FullCalendarModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatMenuModule,
    MatButtonModule,
  ],
  standalone: true
})
export class CalendarComponent implements OnInit {
  @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent | undefined;
  calendarOptions: CalendarOptions | undefined;
  selectedGroup = new FormControl(0);
  private eventsSubject = new Subject<{ groupId: number | null, startStr: string, endStr: string, successCallback: (events: EventInput[]) => void, failureCallback: (error: Error) => void }>();

  constructor(
    private sessionService: SessionService,
    public dialog: MatDialog,
    private ngZone: NgZone,
    private injector: Injector,
    private appRef: ApplicationRef,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.eventsSubject.pipe(
      debounceTime(300)
    ).subscribe(({ groupId, startStr, endStr, successCallback, failureCallback }) => {
      this.loadEvents(groupId, startStr, endStr, successCallback, failureCallback);
    });

    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth,customGroupSelector'
      },
      buttonText: {
        listMonth: 'list'
      },
      customButtons: {
        customGroupSelector: {
          text: '', // No text, we will replace it with custom HTML
          click: () => {} // Empty function, we won't use it
        }
      },
      events: (fetchInfo, successCallback, failureCallback) => {
        const groupId = this.selectedGroup.value === 0 ? null : this.selectedGroup.value;
        this.eventsSubject.next({ groupId, startStr: fetchInfo.startStr, endStr: fetchInfo.endStr, successCallback, failureCallback });
      },
      eventClick: this.handleEventClick.bind(this),
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
    };

    this.insertGroupSelector();
  }

  private insertGroupSelector() {
    setTimeout(() => {
      const customButton = document.querySelector('.fc-customGroupSelector-button');
      if (customButton) {
        const factory = this.resolver.resolveComponentFactory(GroupSelectorComponent);
        const componentRef = factory.create(this.injector);

        componentRef.instance.selectedGroup = this.selectedGroup;

        this.appRef.attachView(componentRef.hostView);
        customButton.appendChild((componentRef.hostView as EmbeddedViewRef<GroupSelectorComponent>).rootNodes[0]);

        this.selectedGroup.valueChanges.subscribe(() => {
          this.refreshEvents();
        });
      }
    }, 0);
  }

  private refreshEvents() {
    const calendarApi = this.calendarComponent?.getApi();
    if (calendarApi) {
      calendarApi.refetchEvents();
    }
  }

  private loadEvents(groupId: number | null, startStr: string, endStr: string, successCallback: (events: EventInput[]) => void, failureCallback: (error: Error) => void) {
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    if (groupId !== null) {
      this.sessionService.getSessionsInDateRange(groupId, startDate, endDate).subscribe(sessions => {
        const events = sessions.map(session => ({
          title: session.title,
          start: session.sessionTimeEnd,
          end: session.sessionTimeEnd,
          extendedProps: {
            id: session.id,
            start: session.sessionTimeEnd,
            end: session.sessionTimeEnd,
            groupName: session.groupName,
            roomName: session.roomName,
            teacherName: session.teacherName,
            feedbackLink: session.feedbackLink,
            sessionType: session.sessionType,
            groupId: session.groupId,
            isFinished: session.isFinished,
            sessionSeriesId: session.sessionSeriesId
          },
          classNames: session.isFinished ? ['is-finished'] : []
        }));
        successCallback(events);
      }, error => {
        failureCallback(error);
      });
    } else {
      // Handle the case where groupId is null (if needed)
      failureCallback(new Error('Group ID is null'));
    }
  }
  
  handleEventClick(clickInfo: EventClickArg) {
    const sessionId = clickInfo.event.extendedProps['id'] as number;
    const groupId = clickInfo.event.extendedProps['groupId'] as number;
  
    if (!groupId) {
      console.error('Group ID is undefined for the clicked event', clickInfo.event.extendedProps);
      return;
    }
  
    // Vous pouvez aussi récupérer plus d'infos comme `sessionSeriesId` ici si nécessaire
    this.sessionService.getSessionById(sessionId).subscribe({
      next: (session) => {
        console.log('Session Data:', session); // Assurez-vous que sessionSeriesId est bien présent ici
        this.sessionService.getStudentsByGroupId(groupId).subscribe({
          next: (students) => {
            const sessionData = {
              ...session,
              students: students.map(s => ({ ...s, id: s.id, isPresent: true })),
              sessionSeriesId: session.sessionSeriesId // Ajout de sessionSeriesId
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
              }
            });
          },
          error: (error) => {
            console.error('Error fetching students:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching session data:', error);
      }
    });
  }
  
}