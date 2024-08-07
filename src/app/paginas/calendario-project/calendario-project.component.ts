import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventSourceFunc } from '@fullcalendar/core';
import { CalendarApi } from '@fullcalendar/core';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-calendario-project',
  standalone: true,
  imports: [ FullCalendarModule],
  templateUrl: './calendario-project.component.html',
  styleUrl: './calendario-project.component.css'
})
export class CalendarioProjectComponent implements OnInit {
  calendarOptions: CalendarOptions;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      initialView: 'timeGridWeek', // Vista inicial del calendario
      weekends: true, // Muestra los fines de semana
      editable: true, // Permite la edición de eventos
      selectable: true, // Permite seleccionar rangos de tiempo
      selectMirror: true, // Permite que las selecciones se reflejen en tiempo real
      dayMaxEvents: true, // Limita el número de eventos por día
      events: this.fetchEvents.bind(this) as EventSourceFunc, // Obtiene eventos desde el servidor
      select: this.handleDateSelect.bind(this), // Maneja la selección de rango de fechas
      eventClick: this.handleEventClick.bind(this), // Maneja clics en eventos
      slotDuration: '01:00:00', // Duración de los intervalos de tiempo (1 hora)
      slotMinTime: '07:00:00', // Hora mínima visible en la vista
      slotMaxTime: '19:00:00', // Hora máxima visible en la vista
      //Ampliar tamaño de la vista
      height: 'auto',

      headerToolbar: {
        left: 'prev,next today', // Botones de navegación
        center: 'title', // Título del calendario
        right: 'timeGridWeek,timeGridDay' // Botones de vista
      },
      views: {
        timeGridWeek: {
          slotDuration: '01:00:00', // Intervalos de una hora en la vista semanal
          slotMinTime: '07:00:00',
          slotMaxTime: '19:00:00',
        },
        timeGridDay: {
          slotDuration: '01:00:00', // Intervalos de una hora en la vista diaria
          slotMinTime: '07:00:00',
          slotMaxTime: '19:00:00',
        }
      },
      eventDisplay: 'block', // Asegúrate de que los eventos se muestren en bloque
    };

  }

  ngOnInit(): void {}

  fetchEvents: EventSourceFunc = (info, successCallback, failureCallback) => {
    this.http.get<any[]>(`${this.apiUrl}/reservasProject`, {
      params: {
        start: info.startStr,
        end: info.endStr
      }
    }).subscribe(
      (data) => {
        console.log('Datos de eventos:', data); // Verifica los datos recibidos
        const formattedEvents = data.map(event => ({
          id: event.id_evento,
          title: event.title,
          start: event.start,
          end: event.end,
          allDay: event.allDay || false,
          color: event.color || '#007bff',
          description: event.description || ''
        }));
        console.log('Eventos formateados:', formattedEvents);
        successCallback(formattedEvents);
      },
      (error: HttpErrorResponse) => {
        console.error('Error al obtener las reservas:', error);
        failureCallback(error);
      }
    );
  }




  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Ingrese el nombre para la reserva:');
    if (title) {
      const reserva = {
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: false, // Puedes ajustar esto según tus necesidades
        color: '', // Si tienes colores predeterminados, añádelos aquí
        description: '' // Si quieres añadir una descripción
      };
      this.http.post<any>(`${this.apiUrl}/reservasProject`, reserva).subscribe(
        (response) => {
          selectInfo.view.calendar.addEvent({
            id: response.id,
            title: response.title,
            start: response.start,
            end: response.end,
            allDay: response.allDay,
            color: response.color,
            description: response.description
          });
          window.alert('Reserva creada con éxito');
          window.location.reload();
        },
        (error: HttpErrorResponse) => {
          console.error('Error al crear la reserva:', error);
          alert('No se pudo crear la reserva. Por favor, intente de nuevo.');
        }
      );
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    const eventTitle = clickInfo.event.title;

    // Muestra la descripción del evento en una alerta o en un modal
    alert(`Evento: ${eventTitle}\n`);

    // Alternativa: si prefieres usar un modal, podrías implementar algo así:
    // this.openDescriptionModal(eventTitle, eventDescription);
  }
}
