import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationBuenaService } from '../../core/services/notification-buena.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, OnDestroy {
  email: string | null = null;
  notifications: any[] = [];
  unreadCount: number = 0;
  private notificationSubscription: Subscription = new Subscription();
  chatVisible: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationBuenaService
  ) { }

  ngOnInit(): void {
    this.email = this.authService.getEmailFromToken();
    this.notificationSubscription = this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter(n => !n.read).length;
    });
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  testTokenDecoding() {
    const email = this.authService.getEmailFromToken();
    const role = this.authService.getRoleFromToken();
    const name = this.authService.getNameFromToken();

    console.log('Email from token:', email);
    console.log('Role from token:', role);
    console.log('Name from token:', name);

    if (email && role) {
      console.log('Token decodificado exitosamente');
    } else {
      console.log('No se pudo decodificar el token o falta información');
    }
  }

  toggleChat() {
    this.chatVisible = !this.chatVisible;
    this.router.navigate(['/chats']);
  }

  markAsRead(notification: any) {
    this.notificationService.markAsRead(notification.id);
  }

  clearNotifications() {
    this.notificationService.clearNotifications();
  }

  deleteNotification(notification: any) {
    this.notificationService.deleteNotification(notification.id);
  }
}
