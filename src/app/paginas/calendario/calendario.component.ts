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
import { EditEventDialogComponent } from './edit-event-dialog/edit-event-dialog.component';
import { ActionDialogComponent } from './action-dialog/action-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [ FullCalendarModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent implements OnInit {
  calendarOptions: CalendarOptions;
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient, public dialog: MatDialog) {
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
    this.http.get<any[]>(`${this.apiUrl}/reservas`, {
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
      this.http.post<any>(`${this.apiUrl}/reservas`, reserva).subscribe(
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
    const event = clickInfo.event;
    const actionDialog = this.dialog.open(ActionDialogComponent);

    actionDialog.afterClosed().subscribe((action) => {
      if (action === 'editar') {
        const editDialog = this.dialog.open(EditEventDialogComponent, {
          data: {
            title: event.title,
            start: event.start,
            end: event.end,
            allDay: event.allDay,
            color: event.backgroundColor,
            description: event.extendedProps['description'] || ''
          }
        });

        editDialog.afterClosed().subscribe((result) => {
          if (result) {
            const updatedEvent = {
              id: event.id,
              title: result.title,
              start: event.start,
              end: event.end,
              allDay: event.allDay,
              color: event.backgroundColor,
              description: result.description
            };

            this.http.put(`${this.apiUrl}/reservas/${event.id}`, updatedEvent).subscribe(
              () => {
                event.setProp('title', result.title);
                window.alert('Reserva actualizada con éxito');
              },
              (error: HttpErrorResponse) => {
                console.error('Error al actualizar la reserva:', error);
                alert('No se pudo actualizar la reserva. Por favor, intente de nuevo.');
              }
            );
          }
        });
      } else if (action === 'eliminar') {
        const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
          data: { message: '¿Está seguro de que desea eliminar este evento?' }
        });

        confirmDialog.afterClosed().subscribe((confirmed) => {
          if (confirmed) {
            this.http.delete(`${this.apiUrl}/reservas/${event.id}`).subscribe(
              () => {
                event.remove();
                window.alert('Evento eliminado con éxito');
              },
              (error: HttpErrorResponse) => {
                console.error('Error al eliminar el evento:', error);
                alert('No se pudo eliminar el evento. Por favor, intente de nuevo.');
              }
            );
          }
        });
      }
    });
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
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      color: event.backgroundColor,
      description: event.extendedProps.description || ''
    };

    this.http.put(`${this.apiUrl}/reservas/${event.id}`, updatedEvent).subscribe(
      (response) => {
        console.log('Reserva actualizada con éxito');
      },
      (error: HttpErrorResponse) => {
        console.error('Error al actualizar la reserva:', error);
        alert('No se pudo actualizar la reserva. Por favor, intente de nuevo.');
        event.revert();
      }
    );
  }
}


