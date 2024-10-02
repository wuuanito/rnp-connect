import { Component } from '@angular/core';
import { MuestrasService } from '../../../../core/services/muestras.service';
import { FormsModule } from '@angular/forms';
import { SolicitudMuestra } from '../../../../core/interfaces/SolicitudMuestra';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-crear-solicitud-muestras',
  standalone: true,
  imports: [FormsModule,CommonModule,MatTooltipModule],
  templateUrl: './crear-solicitud-muestras.component.html',
  styleUrl: './crear-solicitud-muestras.component.css'
})
export class CrearSolicitudMuestrasComponent {
  selectedOption: string = '';

  solicitud: SolicitudMuestra = {
    solicitante: '',
    nombreMp: '',
    lote: '',
    proveedor: '',
    urgencia: '',
    fecha: new Date(),
    estado: "Pendiente",
    codigoArticulo: '',
    comentarios: '',
    mensajes: [],
    expediciones: false,
    laboratorio: false,
    almacen: false,
    mensajesNoLeidos: 0
  };

  constructor(private solicitudService: MuestrasService, private router: Router) { }
  tooltipVisible: boolean = false;
  tooltipMessage: string = '';
  tooltips = {
    expediciones: 'Project Manager → Expediciones',
    laboratorio: 'Project Manager → Laboratorio (laboratorio → Almacén (si es necesario) → Project Manager))',
    almacen: 'Project Manager → Almacén → Project Manager'
  };

  showTooltip(message: string) {
    this.tooltipMessage = message;
    this.tooltipVisible = true;
  }
  selectedLaboratorioOption: string = ''; // Almacena la opción del desplegable

  hideTooltip() {
    this.tooltipVisible = false;
    this.tooltipMessage = '';
  }

  onSubmit() {
    console.log('Opción seleccionada del laboratorio:', this.selectedLaboratorioOption); // Verifica el valor aquí

    const solicitudParaCrear = {
        ...this.solicitud,
        selectedLaboratorioOption: this.selectedLaboratorioOption,
        idSolicitudMuestra: undefined
    };

    this.solicitudService.createSolicitud(solicitudParaCrear).subscribe({
        next: (response) => {
            console.log('Solicitud creada:', response);
            alert('Solicitud creada correctamente');
            window.location.reload();
        },
        error: (error) => {
            console.error('Error al crear la solicitud', error);
        }
    });
}




  onOptionChange(option: string) {
    this.selectedOption = option;

    // Resetear todas las opciones
    this.solicitud.expediciones = false;
    this.solicitud.laboratorio = false;
    this.solicitud.almacen = false;

    // Activar solo la opción seleccionada
    switch(option) {
      case 'expediciones':
        this.solicitud.expediciones = true;
        break;
      case 'laboratorio':
        this.solicitud.laboratorio = true;
        break;
      case 'almacen':
        this.solicitud.almacen = true;
        break;
    }
  }
}
