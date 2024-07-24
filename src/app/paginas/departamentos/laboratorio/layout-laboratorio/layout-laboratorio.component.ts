import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { AppNotificationComponent } from '../../../notificaciones/app-notification/app-notification.component';
import { Subscription } from 'rxjs';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { EventService } from '../../../../core/events/events.service';
import { Solicitud } from '../../../../core/interfaces/solicitud.mode';
@Component({
  selector: 'app-layout-laboratorio',
  standalone: true,
  imports: [RouterOutlet,RouterLink,AppNotificationComponent],
  templateUrl: './layout-laboratorio.component.html',
  styleUrl: './layout-laboratorio.component.css'
})
export class LayoutLaboratorioComponent implements OnInit, OnDestroy {
  notificationMessage: string = '';
  showNotification: boolean = false;
  private eventSubscription: Subscription = new Subscription();

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.requestNotificationPermission();
    this.eventSubscription = this.eventService.nuevaSolicitud$.subscribe(
      (nuevaSolicitud: Solicitud) => {
        this.mostrarNotificacion(nuevaSolicitud);
      }
    );
  }

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  private requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }

  private mostrarNotificacion(solicitud: Solicitud): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Nueva Solicitud', {
        body: `Se ha creado una nueva solicitud: ${solicitud.nombre_solicitud}`,
        icon: '/assets/icons/notification-icon.png',
      });
    }

    this.notificationMessage = `Nueva solicitud: ${solicitud.nombre_solicitud}`;
    this.showNotification = true;
    setTimeout(() => this.closeNotification(), 5000);
  }

  closeNotification(): void {
    this.showNotification = false;
  }
}
