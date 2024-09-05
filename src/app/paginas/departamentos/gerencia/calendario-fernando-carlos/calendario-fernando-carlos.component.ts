import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventSourceFunc } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';
import { EditEventDialogComponent } from './edit-event-dialog/edit-event-dialog.component';
import { ActionDialogComponent } from './action-dialog/action-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AddEventDialogComponent } from './add-event-dialog-component/add-event-dialog-component.component';
import io from 'socket.io-client';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-calendario-fernando-carlos',
  standalone: true,
  imports: [
    FullCalendarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './calendario-fernando-carlos.component.html',
  styleUrls: ['./calendario-fernando-carlos.component.css']
})
export class CalendarioFernandoCarlosComponent implements OnInit, OnDestroy {
  calendarOptions: CalendarOptions;
  upcomingEvents: EventApi[] = [];
  eventsWithDescriptions: any[] = [];
  private apiUrl = environment.apiUrl;
  private socket: any;

  constructor(private http: HttpClient, public dialog: MatDialog, private authService: AuthService) {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      events: this.fetchEvents.bind(this) as EventSourceFunc,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      height: 'auto',
      firstDay: 1,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth'
      },
      eventDisplay: 'block',
      datesSet: this.handleDatesSet.bind(this),
      locale: 'es',
      eventContent: this.renderEventContent.bind(this) // Add this line
    };
  }

  ngOnInit(): void {
    this.socket = io(environment.apiUrl); // Conéctate al servidor de Socket.IO

    this.socket.on('eventCreated', () => {
      this.fetchEventsFromApi();
    });

    this.socket.on('eventUpdated', () => {
      this.fetchEventsFromApi();
    });

    this.socket.on('eventDeleted', () => {
      this.fetchEventsFromApi();
    });
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }


fetchEventsFromApi() {
    const startDate = new Date().toISOString();
    const endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

    this.http.get<any[]>(`${this.apiUrl}/reservas`, {
      params: {
        start: startDate,
        end: endDate
      }
    }).subscribe(
      (data) => {
        const formattedEvents = data.map(event => ({
          id: event.id_evento,
          title: event.title,
          start: event.start,
          end: event.end,
          allDay: event.allDay || false,
          color: this.getEventColor(event.title), // Use the new method to set color
          description: event.description || ''
        }));
        this.eventsWithDescriptions = formattedEvents;
        this.updateUpcomingEvents(formattedEvents);
        if (this.calendarOptions?.events) {
          this.calendarOptions.events = this.eventsWithDescriptions;
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error al obtener las reservas:', error);
      }
    );
  }
  getEventColor(title: string): string {
    if (title.toLowerCase().startsWith('carlos')) {
      return '#1565c0'; // Green color for Carlos
    } else if (title.toLowerCase().startsWith('fernando')) {
      return '#ef6c00'; // Blue color for Fernando
    } else {
      return '#2e7d32'; // Default yellow color for other cases
    }
  }

  // Add this new method to customize event rendering
  renderEventContent(eventInfo: any) {
    return {
      html: `<div class="fc-event-main-frame">
               <div class="fc-event-title-container">
                 <div class="fc-event-title fc-sticky">${eventInfo.event.title}</div>
               </div>
             </div>`
    };
  }

  fetchEvents: EventSourceFunc = (info, successCallback, failureCallback) => {
    this.fetchEventsFromApi(); // Actualiza los eventos
    successCallback(this.eventsWithDescriptions); // Pasa los eventos al calendario
  };



  getEventDescriptionById(eventId: string): string {
    const event = this.eventsWithDescriptions.find(e => e.id === eventId);
    return event ? event.description : '';
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const userName = this.authService.getNameFromToken() || 'Usuario';
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '400px',
      data: {
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newEvent = {
          title: `${userName}-${result.title}`,
          description: result.description,
          start: result.start,
          end: result.end,
          allDay: result.allDay,
          color: this.getEventColor(`${userName}-${result.title}`) // Use the new method to set color
        };

        this.http.post<any>(`${this.apiUrl}/reservas`, newEvent).subscribe(
          (response) => {
            selectInfo.view.calendar.addEvent({
              id: response.id,
              title: response.title,
              description: response.description,
              start: response.start,
              end: response.end,
              allDay: response.allDay,
              color: response.color
            });
            window.alert('Reserva creada con éxito');
            this.socket.emit('eventCreated');
          },
          (error: HttpErrorResponse) => {
            console.error('Error al crear la reserva:', error);
            alert('No se pudo crear la reserva. Por favor, intente de nuevo.');
          }
        );
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    const event = clickInfo.event;
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Está seguro de que desea eliminar este evento?' }
    });

    confirmDialog.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.http.delete(`${this.apiUrl}/reservas/${event.id}`).subscribe(
          () => {
            event.remove();
            window.alert('Evento eliminado con éxito');
            this.socket.emit('eventDeleted');
          },
          (error: HttpErrorResponse) => {
            console.error('Error al eliminar el evento:', error);
            alert('No se pudo eliminar el evento. Por favor, intente de nuevo.');
          }
        );
      }
    });
  }


  handleDatesSet(dateInfo: any) {
    this.fetchEvents(dateInfo, (events) => {
      this.updateUpcomingEvents(events);
    }, () => {});
  }

  updateUpcomingEvents(events: any[]) {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 30);

    this.upcomingEvents = events
      .filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 20);
  }

  handleEventDrop(dropInfo: any) {
    this.updateEventDates(dropInfo.event);
  }

  handleEventResize(resizeInfo: any) {
    this.updateEventDates(resizeInfo.event);
  }

  private updateEventDates(event: any) {
    const updatedEvent = {
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,
      color: event.backgroundColor,
      description: event.extendedProps.description || ''
    };

    this.http.put(`${this.apiUrl}/reservas/${event.id}`, updatedEvent).subscribe(
      (response) => {
        console.log('Reserva actualizada con éxito');
        this.socket.emit('eventUpdated');
      },
      (error: HttpErrorResponse) => {
        console.error('Error al actualizar la reserva:', error);
        alert('No se pudo actualizar la reserva. Por favor, intente de nuevo.');
        event.revert();
      }
    );
  }
}
