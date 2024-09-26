import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventSourceFunc } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import io from 'socket.io-client';
import { AuthService } from '../../core/services/auth.service';
import { AddEventDialogComponent } from './add-event-dialog-component/add-event-dialog-component.component';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    FullCalendarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy {

  @ViewChild('eventDetailsModal') eventDetailsModal: TemplateRef<any> | undefined;
  calendarOptions: CalendarOptions;
  upcomingEvents: EventApi[] = [];
  eventsWithDescriptions: any[] = [];
  selectedEvent: any = null;
  showModal: boolean = false;
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
      eventContent: this.renderEventContent.bind(this),
      eventDrop: this.handleEventDrop.bind(this),
      eventResize: this.handleEventResize.bind(this),
      // New options for day names and week numbers
      dayHeaderFormat: { weekday: 'long' },
      weekNumbers: true,
      weekNumberFormat: { week: 'numeric' },
      weekText: 'Semana ',
      // Custom rendering for week numbers
      weekNumberContent: (arg: any) => {
        return 'Semana - ' + arg.num;
      }
    };
  }

  ngOnInit(): void {
    this.socket = io(environment.apiUrl);

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
  formatEventTitle(title: string, sala: string): string {
    return sala ? `${title} - ${sala}` : title;
  }


  fetchEventsFromApi() {
    const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();
    const endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

    this.http.get<any[]>(`${this.apiUrl}/reservasPrincipales`, {
      params: {
        start: startDate,
        end: endDate
      }
    }).subscribe(
      (data) => {
        console.log('Eventos obtenidos:', data);
        this.eventsWithDescriptions = data.map(event => ({
          id: event.id_evento,
          title: this.formatEventTitle(event.title, event.sala), // Cambiado el orden de los parámetros
          start: event.start,
          end: event.end,
          allDay: event.allDay || false,
          color: event.color || this.getEventColor(event.title),
          description: event.description || '',
          responsable: event.responsable || '',
          sala: event.sala || '',
          originalTitle: event.title,
          participants: event.participantes || []
        }));
        this.updateUpcomingEvents(this.eventsWithDescriptions);
        if (this.calendarOptions?.events) {
          this.calendarOptions.events = this.eventsWithDescriptions;
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error al obtener las reservas:', error);
        if (error.error && error.error.message) {
          console.error('Mensaje de error del servidor:', error.error.message);
        }
      }
    );
  }
  getEventColor(title: string): string {
    if (title.toLowerCase().startsWith('vero')) {
      return '#1565c0';
    } else if (title.toLowerCase().startsWith('andrea')) {
      return '#ef6c00';
    } else {
      return '#2e7d32';
    }
  }

  renderEventContent(eventInfo: any) {
    return {
      html: `<div class="fc-event-main-frame" style="background-color: ${eventInfo.event.backgroundColor};">
               <div class="fc-event-title-container">
                 <div class="fc-event-title fc-sticky">${eventInfo.event.title}</div>
               </div>
             </div>`
    };
  }

  fetchEvents: EventSourceFunc = (info, successCallback, failureCallback) => {
    this.fetchEventsFromApi();
    successCallback(this.eventsWithDescriptions);
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
        const participantsArray = result.participants?.map((p: any) => p.email.trim()) || [];

        const newEvent = {
          title: result.title,
          description: result.description,
          start: result.start,
          end: result.end,
          allDay: result.allDay,
          color: result.color,
          participants: participantsArray,
          sala: result.sala, // Asegúrate de que este campo esté presente
          responsable: result.responsable
      };

        console.log('Nuevo evento a crear:', newEvent);

        this.http.post<any>(`${this.apiUrl}/reservasPrincipales`, newEvent).subscribe(
          (response) => {
            selectInfo.view.calendar.addEvent({
              id: response.id,
              title: this.formatEventTitle(response.title, response.sala),
              description: response.description,
              start: response.start,
              end: response.end,
              allDay: response.allDay,
              color: response.color,
              extendedProps: {
                participants: response.participants,
                sala: response.sala,
                responsable: response.responsable,
                originalTitle: response.title
              }
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
    this.selectedEvent = {
      title: clickInfo.event.extendedProps['originalTitle'] || clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      startTime: clickInfo.event.extendedProps['startTime'] || '',
      description: clickInfo.event.extendedProps['description'] || '',
      responsable: clickInfo.event.extendedProps['responsable'] || '',
      sala: clickInfo.event.extendedProps['sala'] || '',
      participants: clickInfo.event.extendedProps['participants'] || [],
      id: clickInfo.event.id
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  handleDatesSet(dateInfo: any) {
    this.fetchEvents(dateInfo, (events) => {
      this.updateUpcomingEvents(events);
    }, () => {});
  }

  updateUpcomingEvents(events: any[]) {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    this.upcomingEvents = events
      .filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= today && eventDate <= nextMonth;
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
      title: event.extendedProps['originalTitle'] || event.title,
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,
      color: event.backgroundColor,
      description: event.extendedProps['description'] || '',
      participants: event.extendedProps['participants'] || [],
      sala: event.extendedProps['sala'] || '', // Incluye sala aquí
      responsable: event.extendedProps['responsable'] || ''
    };
    this.http.put(`${this.apiUrl}/reservasPrincipales/${event.id}`, updatedEvent).subscribe(
      (response) => {
        console.log('Reserva actualizada con éxito');
        // Actualizar el título del evento en el calendario
        event.setProp('title', this.formatEventTitle(updatedEvent.title, updatedEvent.sala)); // Aquí se aplica el formato
        this.socket.emit('eventUpdated');
      },
      (error: HttpErrorResponse) => {
        console.error('Error al actualizar la reserva:', error);
        alert('No se pudo actualizar la reserva. Por favor, intente de nuevo.');
        event.revert();
      }
    );
  }
  deleteEvent(): void {
    if (!this.selectedEvent || !this.selectedEvent.id) {
      console.error('No se ha seleccionado un evento válido para eliminar');
      return;
    }

    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este evento?');

    if (confirmed) {
      this.http.delete(`${this.apiUrl}/reservasPrincipales/${this.selectedEvent.id}`).subscribe(
        () => {
          console.log('Evento eliminado con éxito');
          this.socket.emit('eventDeleted');
          this.fetchEventsFromApi();
        },
        (error: HttpErrorResponse) => {
          console.error('Error al eliminar el evento:', error);
          alert('No se pudo eliminar el evento. Por favor, intente de nuevo.');
        }
      );
    }
  }


}
