import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventSourceFunc } from '@fullcalendar/core';
import { CalendarApi } from '@fullcalendar/core';


@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [ FullCalendarModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent implements OnInit {
  calendarOptions: CalendarOptions;

  constructor(private http: HttpClient) {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      initialView: 'timeGridWeek',
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      events: this.fetchEvents.bind(this) as EventSourceFunc,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      slotDuration: '01:00:00',
      slotMinTime: '08:00:00',
      slotMaxTime: '20:00:00',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      eventDisplay: 'block', // Asegúrate de que los eventos se muestren en bloque
    };

  }

  ngOnInit(): void {}

  fetchEvents: EventSourceFunc = (info, successCallback, failureCallback) => {
    this.http.get<any[]>('http://localhost:3000/reservas', {
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
      this.http.post<any>('http://localhost:3000/reservas', reserva).subscribe(
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
    if (confirm(`¿Está seguro de que desea eliminar la reserva '${clickInfo.event.title}'?`)) {
      this.http.get<any[]>('http://localhost:3000/reservas').subscribe(
        () => {
          clickInfo.event.remove();
        },
        (error: HttpErrorResponse) => {
          console.error('Error al eliminar la reserva:', error);
          alert('No se pudo eliminar la reserva. Por favor, intente de nuevo.');
        }
      );
    }
  }
}
