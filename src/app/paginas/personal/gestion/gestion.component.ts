import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPaginationModule } from 'ngx-pagination'; // Import the NgxPaginationModule
import { SolicitudesService } from '../../../core/services/solicitudes.service';
import { Personal } from '../../../core/interfaces/personal';
import { PersonalService } from '../../../core/services/personal.service';

@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [CommonModule,FormsModule,PaginationModule,NgxPaginationModule],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.css'
})
export class GestionComponent implements OnInit {
  solicitudes: Personal[] = [];
  filteredSolicitudes: Personal[] = [];
  solicitudSeleccionada: Personal | null = null;

  filter = {
    nombreSolicitante: '',
    puesto: '',
    estado: ''
  };

  constructor(private personalService: PersonalService) { }

  ngOnInit() {
    this.loadSolicitudes();
  }

  loadSolicitudes() {
    this.personalService.getSolicitudes().subscribe(
      (data: any) => {
        this.solicitudes = data.data;
        this.applyFilters();
      },
      error => {
        console.error('Error al cargar las solicitudes:', error);
      }
    );
  }

  applyFilters() {
    this.filteredSolicitudes = this.solicitudes.filter(solicitud => {
      return (
        solicitud.nombreSolicitante.toLowerCase().includes(this.filter.nombreSolicitante.toLowerCase()) &&
        solicitud.puesto.toLowerCase().includes(this.filter.puesto.toLowerCase()) &&
        (this.filter.estado === '' || solicitud.estado === this.filter.estado)
      );
    });
  }

  verDetalles(solicitud: Personal) {
    this.solicitudSeleccionada = solicitud;
  }

  aprobarSolicitud(solicitud: Personal) {
    solicitud.estado = 'Aprobada';
    this.personalService.updateSolicitud(solicitud.id!, solicitud).subscribe(
      (updatedSolicitud: any) => {
        console.log('Solicitud aprobada:', updatedSolicitud);
        this.loadSolicitudes(); // Recargar la lista después de la actualización
      },
      error => {
        console.error('Error al aprobar la solicitud:', error);
      }
    );
  }

  rechazarSolicitud(solicitud: Personal) {
    solicitud.estado = 'Rechazada';
    this.personalService.updateSolicitud(solicitud.id!, solicitud).subscribe(
      (updatedSolicitud: any) => {
        console.log('Solicitud rechazada:', updatedSolicitud);
        this.loadSolicitudes(); // Recargar la lista después de la actualización
      },
      error => {
        console.error('Error al rechazar la solicitud:', error);
      }
    );
  }
}
