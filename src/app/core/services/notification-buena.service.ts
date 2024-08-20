import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationBuenaService {
  private notifications = new BehaviorSubject<any[]>([]);
  private socket: Socket;

  constructor(private snackBar: MatSnackBar, private authService: AuthService) {
    this.socket = io(environment.apiUrl);
    this.setupSocketListeners();
    this.loadNotificationsFromStorage();
  }

  private setupSocketListeners() {
    this.socket.on('nuevaSolicitud', (solicitud: any) => {
      this.addNotification({
        message: `Nueva solicitud recibida: ${solicitud.nombre_solicitud}`,
        type: 'nueva',
        read: false,
        timestamp: new Date().toISOString(),
        role: solicitud.role // Suponiendo que el backend te envía el rol
      });
    });

    this.socket.on('actualizacionSolicitud', (solicitud: any) => {
      this.addNotification({
        message: `Solicitud actualizada: ${solicitud.nombre_solicitud}`,
        type: 'actualizada',
        read: false,
        timestamp: new Date().toISOString(),
        role: solicitud.role // Suponiendo que el backend te envía el rol
      });
    });
  }

  private loadNotificationsFromStorage() {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      this.notifications.next(JSON.parse(storedNotifications));
    }
  }

  private saveNotificationsToStorage() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications.value));
  }

  getNotifications() {
    return this.notifications.asObservable();
  }

  addNotification(notification: any) {
    const current = this.notifications.value;
    const updatedNotifications = [...current, notification];
    this.notifications.next(updatedNotifications);
    this.saveNotificationsToStorage();

    // Mostrar notificación snackbar en el centro y con estilos personalizados
    this.snackBar.open(notification.message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  sendNotificationToRole(message: string, type: string, role: string) {
    // Aquí puedes agregar la lógica para enviar una notificación a un rol específico
    this.addNotification({
      id: Date.now().toString(),
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
      role
    });
  }

  markAsRead(notificationId: string) {
    const current = this.notifications.value;
    const updated = current.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notifications.next(updated);
    this.saveNotificationsToStorage();
  }

  deleteNotification(notificationId: string) {
    const current = this.notifications.value;
    const updated = current.filter(n => n.id !== notificationId);
    this.notifications.next(updated);
    this.saveNotificationsToStorage();
  }

  clearNotifications() {
    this.notifications.next([]);
    this.saveNotificationsToStorage();
  }
}
