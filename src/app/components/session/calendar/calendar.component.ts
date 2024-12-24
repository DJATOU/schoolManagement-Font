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
            const events = sessions.map(session => {
                console.log('Generating Event for Session:', session); // Vérifiez ici les données de session

                return {
                    id: session.id.toString(), // Assurez-vous que l'ID est bien unique
                    title: session.title,
                    start: new Date(session.sessionTimeStart),
                    end: new Date(session.sessionTimeEnd),
                    extendedProps: {
                        id: session.id, // Cet ID doit être unique et correct
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
                };
            });

            console.log('Generated Events:', events); // Vérifiez que les événements ont bien des IDs uniques
            successCallback(events);
        }, error => {
            failureCallback(error);
        });
    } else {
        failureCallback(new Error('Group ID is null'));
    }
}


handleEventClick(clickInfo: EventClickArg) {
  // Log complet de l'événement cliqué pour déboguer
  console.log('Full Event Data:', clickInfo.event); 
  
  // Récupérer l'ID de la session depuis extendedProps et le convertir en nombre
  const sessionId = parseInt(clickInfo.event.extendedProps['id'], 10);
  
  // Log pour s'assurer que l'ID extrait est celui attendu
  console.log('Extracted Session ID:', sessionId);

  // Vérifier si l'ID est NaN ou invalide (<= 0)
  if (isNaN(sessionId) || sessionId <= 0) {
    console.error('Session ID is NaN or invalid:', sessionId);
    return;
  }

  // Si l'ID est valide, récupérer les données de session depuis le service
  this.sessionService.getSessionById(sessionId).subscribe({
    next: (session) => {
      // Log des données de la session récupérées pour vérification
      console.log('Session Data retrieved from service:', session);

      // Continuez avec la logique de traitement ici, par exemple l'ouverture d'une modale
      const sessionData = {
        ...session,
        students: [], // Ajouter ici la logique pour les étudiants si nécessaire
      };

      // Ouverture de la modale avec les données de session
      const dialogRef = this.dialog.open(SessionModalComponent, {
        data: sessionData,
        width: '600px',
        maxHeight: '90vh'
      });

      // Gérer les actions après la fermeture de la modale
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.isFinished) {
          clickInfo.event.setProp('classNames', ['is-finished']);
          clickInfo.event.setExtendedProp('isFinished', true);
        }
      });
    },
    error: (error) => {
      // Log en cas d'erreur lors de la récupération des données de session
      console.error('Error fetching session data:', error);
    }
  });
}




  


  
}