import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MuestrasService } from '../../../../core/services/muestras.service';
import { Mensaje, SolicitudMuestra } from '../../../../core/interfaces/SolicitudMuestra';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MensajeService } from '../../../../core/services/mensaje.service';
import { FormsModule } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { UploadService } from '../../../../core/services/upload.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-ver-solicitud-muestras',
  standalone: true,
  imports: [DatePipe,CommonModule,FormsModule],
  templateUrl: './ver-solicitud-muestras.component.html',
  styleUrl: './ver-solicitud-muestras.component.css'
})
export class VerSolicitudMuestrasComponent implements OnInit  {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  solicitudes: SolicitudMuestra[] = [];
  solicitudSeleccionada: SolicitudMuestra | null = null;
  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  pollingSubscription: Subscription | undefined;
  files: any[] = []; // Arreglo para almacenar los archivos

  constructor(
    private solicitudService: MuestrasService,
    private mensajeService: MensajeService,
    private authService: AuthService,
    private fileUploadService:UploadService
  ) {}

  nombre = this.authService.getNameFromToken() || '';

  ngOnInit(): void {
    this.obtenerSolicitudes();
    this.nombre = this.authService.getNameFromToken() || '';

  }

  ngOnDestroy(): void {
    this.detenerPolling();
  }

  obtenerSolicitudes(): void {
    this.solicitudService.getSolicitudes().subscribe(
      (data: SolicitudMuestra[]) => {
        console.log('Datos obtenidos de solicitudes:', data);
        this.solicitudes = data;
      },
      error => console.error('Error al obtener solicitudes', error)
    );
  }



  obtenerNombreToken(): string | null {
    return this.nombre = this.authService.getNameFromToken() || '';
  }
  cargarDetalles(solicitud: SolicitudMuestra): void {
    this.solicitudSeleccionada = solicitud;
    console.log('Solicitud seleccionada en cargarDetalles:', this.solicitudSeleccionada);

    if (this.solicitudSeleccionada?.idSolicitudMuestra) {
      this.obtenerMensajes();
      this.iniciarPolling();
    } else {
      console.error('ID de solicitud no está definido o es inválido en cargarDetalles.');
    }
  }

  obtenerMensajes(): void {
    if (this.solicitudSeleccionada?.idSolicitudMuestra) {
      this.mensajeService.getMensajes(this.solicitudSeleccionada.idSolicitudMuestra).subscribe(
        (mensajes: Mensaje[]) => {
          console.log('Mensajes obtenidos:', mensajes); // Agrega este log
          this.mensajes = mensajes;
        },
        error => console.error('Error al obtener mensajes', error)
      );
    }
  }

  enviarMensaje(): void {
    const nombreRemitente = this.authService.getNameFromToken() || 'defaultName';
    if (this.solicitudSeleccionada?.idSolicitudMuestra && this.nuevoMensaje.trim()) {
      const mensaje: Mensaje = {
        remitente: nombreRemitente,
        contenido: this.nuevoMensaje.trim(),
        fecha: new Date(),
        solicitudMuestraId: this.solicitudSeleccionada.idSolicitudMuestra
      };

      this.mensajeService.createMensaje(mensaje).subscribe(
        (mensajeCreado: Mensaje) => {
          console.log('Mensaje enviado:', mensajeCreado);
          this.nuevoMensaje = '';
          this.obtenerMensajes();
        },
        error => {
          console.error('Error al enviar mensaje', error);
          // Aquí puedes agregar lógica para mostrar el error al usuario
        }
      );
    } else {
      console.error('ID de solicitud no está definido o el mensaje está vacío.');
    }
  }

  iniciarPolling(): void {
    this.detenerPolling(); // Detener cualquier polling existente antes de iniciar uno nuevo
    this.pollingSubscription = timer(0, 5000).subscribe(() => {
      this.obtenerMensajes();
    });
  }

  detenerPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
  archivos: any[] = [];
  selectedFile: File | null = null;
  //Asignar el id de la solicitud de muestra seleccionada
  idSolicitudMuestra:number =
  this.solicitudSeleccionada?.idSolicitudMuestra || 0;

  // Método para subir archivos con el id de la solicitud
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }



  // Método para subir archivos

}



