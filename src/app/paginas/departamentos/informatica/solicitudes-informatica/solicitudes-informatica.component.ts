import { Component,OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



interface Solicitud {
  id: string;
  tipo: 'Enviada' | 'Recibida';
  asunto: string;
  fecha: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
}


@Component({
  selector: 'app-solicitudes-informatica',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './solicitudes-informatica.component.html',
  styleUrl: './solicitudes-informatica.component.css'
})
export class SolicitudesInformaticaComponent implements OnInit{

  solicitudes: Solicitud[] = [
    { id: '001', tipo: 'Enviada', asunto: 'Solicitud de vacaciones', fecha: '2024-07-15', estado: 'Pendiente' },
    { id: '002', tipo: 'Recibida', asunto: 'Aprobación de presupuesto', fecha: '2024-07-14', estado: 'Aprobada' },
    { id: '003', tipo: 'Enviada', asunto: 'Solicitud de equipo nuevo', fecha: '2024-07-13', estado: 'Rechazada' },
  ];

  solicitudesFiltradas: Solicitud[] = [];
  tipoFiltro: string = '';
  estadoFiltro: string = '';

  resumen = {
    total: 0,
    enviadas: 0,
    recibidas: 0
  };

  ngOnInit() {
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.solicitudesFiltradas = this.solicitudes.filter(solicitud =>
      (this.tipoFiltro === '' || solicitud.tipo === this.tipoFiltro) &&
      (this.estadoFiltro === '' || solicitud.estado === this.estadoFiltro)
    );
    this.actualizarResumen();
  }

  actualizarResumen() {
    this.resumen.total = this.solicitudesFiltradas.length;
    this.resumen.enviadas = this.solicitudesFiltradas.filter(s => s.tipo === 'Enviada').length;
    this.resumen.recibidas = this.solicitudesFiltradas.filter(s => s.tipo === 'Recibida').length;
  }
}
