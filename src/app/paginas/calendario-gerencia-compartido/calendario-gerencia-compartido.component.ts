import { Component, OnInit } from '@angular/core';

import { FullCalendarModule } from '@fullcalendar/angular';

import { CommonModule } from '@angular/common';
import { EventosCompartidosService } from '../../core/services/eventos-compartidos.service';
@Component({
  selector: 'app-calendario-gerencia-compartido',
  standalone: true,
  imports: [ FullCalendarModule,CommonModule],
  templateUrl: './calendario-gerencia-compartido.component.html',
  styleUrl: './calendario-gerencia-compartido.component.css'
})
  export class CalendarioGerenciaCompartidoComponent implements OnInit {
    events: Event[] = [];
    currentView: 'month' | 'week' | 'day' = 'month';
    currentDate: Date = new Date();

    constructor(private eventService: EventosCompartidosService) {}

    ngOnInit(): void {
      this.events = this.eventService.getEvents();
    }

    changeView(view: 'month' | 'week' | 'day'): void {
      this.currentView = view;
    }

    previousPeriod(): void {
      switch (this.currentView) {
        case 'month':
          this.currentDate.setMonth(this.currentDate.getMonth() - 1);
          break;
        case 'week':
          this.currentDate.setDate(this.currentDate.getDate() - 7);
          break;
        case 'day':
          this.currentDate.setDate(this.currentDate.getDate() - 1);
          break;
      }
    }

    nextPeriod(): void {
      switch (this.currentView) {
        case 'month':
          this.currentDate.setMonth(this.currentDate.getMonth() + 1);
          break;
        case 'week':
          this.currentDate.setDate(this.currentDate.getDate() + 7);
          break;
        case 'day':
          this.currentDate.setDate(this.currentDate.getDate() + 1);
          break;
      }
    }
  }
