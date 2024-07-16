import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  features = [
    { icon: 'fa-network-wired', title: 'Conexión rápida', description: 'Conecta con tus dispositivos RNP en segundos' },
    { icon: 'fa-lock', title: 'Seguridad avanzada', description: 'Protección de datos de última generación' },
    { icon: 'fa-chart-line', title: 'Análisis en tiempo real', description: 'Monitorea el rendimiento de tu red al instante' },
    { icon: 'fa-mobile-alt', title: 'Control móvil', description: 'Gestiona tu red desde cualquier dispositivo' }
  ];
}
