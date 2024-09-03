import { Injectable } from '@angular/core';
import {Event} from '../interfaces/event'
@Injectable({
  providedIn: 'root'
})
export class EventosCompartidosService {
  private events: Event[] = [
    {
      id: 1,
      title: 'Reunión de equipo',
      description: 'Reunión semanal de actualización',
      startDate: new Date(2024, 8, 5, 10, 0),
      endDate: new Date(2024, 8, 5, 11, 0),
      isFeatured: false
    },
    {
      id: 2,
      title: 'Lanzamiento de producto',
      description: 'Presentación del nuevo producto',
      startDate: new Date(2024, 8, 15, 14, 0),
      endDate: new Date(2024, 8, 15, 16, 0),
      isFeatured: true
    },
    // Agrega más eventos de ejemplo aquí
  ];

  getEvents(): Event[] {
    return this.events;
  }

  getFeaturedEvents(): Event[] {
    return this.events.filter(event => event.isFeatured);
  }
}
