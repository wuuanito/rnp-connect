import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-notification.component.html',
  styleUrl: './app-notification.component.css'
})
export class AppNotificationComponent {
  @Input() message: string = '';
  @Input() show: boolean = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
