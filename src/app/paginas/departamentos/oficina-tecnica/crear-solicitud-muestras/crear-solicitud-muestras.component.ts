import { Component } from '@angular/core';
import { MuestrasService } from '../../../../core/services/muestras.service';
import { FormsModule } from '@angular/forms';
import { SolicitudMuestra } from '../../../../core/interfaces/SolicitudMuestra';
import { Router } from '@angular/router';
@Component({
  selector: 'app-crear-solicitud-muestras',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './crear-solicitud-muestras.component.html',
  styleUrl: './crear-solicitud-muestras.component.css'
})
export class CrearSolicitudMuestrasComponent {

  solicitud: SolicitudMuestra = {
    solicitante: '',
    nombreMp: '',
    lote: '',
    proveedor: '',
    urgencia: '',
    fecha: new Date(),
    estado: 'Pendiente', // Estado inicial
    codigoArticulo: '',
    comentarios: '',
    mensajes: [] // Agregado para conversaciones
  };

  constructor(private solicitudService: MuestrasService, private router: Router) { }
  onSubmit() {
    // Crear un nuevo objeto sin el idSolicitudMuestra
    const solicitudParaCrear = {
      ...this.solicitud,
      idSolicitudMuestra: undefined // Excluir el id
    };

    this.solicitudService.createSolicitud(solicitudParaCrear).subscribe(
      response => {
        console.log('Solicitud creada:', response);
        this.router.navigate(['/oficina-tecnica/ver-solicitudes']);
      },
      error => {
        console.error('Error al crear la solicitud', error);
      }
    );
  }

}
