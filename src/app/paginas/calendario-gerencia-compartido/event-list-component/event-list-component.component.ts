import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventosCompartidosService} from '../../../core/services/eventos-compartidos.service'
@Component({
  selector: 'app-event-list-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list-component.component.html',
  styleUrl: './event-list-component.component.css'
})
export class EventListComponentComponent implements OnInit {
  upcomingEvents: Event[] = [];

  constructor(private eventService: EventosCompartidosService) {}

  ngOnInit(): void {
    this.upcomingEvents = this.eventService.getEvents()
      .filter(event => event.startDate > new Date())
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, 5);
  }
}
