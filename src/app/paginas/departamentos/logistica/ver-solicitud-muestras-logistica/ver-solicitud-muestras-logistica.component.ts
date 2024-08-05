import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
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
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-ver-solicitud-muestras-logistica',
  standalone: true,
  imports: [DatePipe,CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './ver-solicitud-muestras-logistica.component.html',
  styleUrl: './ver-solicitud-muestras-logistica.component.css'
})
export class VerSolicitudMuestrasLogisticaComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  solicitudes: SolicitudMuestra[] = [];
  solicitudesAlmacen: SolicitudMuestra[] = [];
  solicitudSeleccionada: SolicitudMuestra | null = null;
  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  pollingSubscription: Subscription | undefined;
  files: any[] = [];
  page: number = 1;
  itemsPerPage: number = 10;
  mostrarBotonBajar: boolean = false;

  // Filtros
  filtros = {
    solicitante: '',
    nombreMp: '',
    proveedor: '',
    estado: ''
  };

  constructor(
    private solicitudService: MuestrasService,
    private mensajeService: MensajeService,
    private authService: AuthService,
    private fileUploadService: UploadService
  ) {}

  nombre = this.authService.getNameFromToken() || '';

  ngOnInit(): void {
    this.obtenerSolicitudes();
    this.nombre = this.authService.getNameFromToken() || '';
    this.obtenerSolicitudesAlmacen();
  }

  checkScrollPosition() {
    const container = this.chatContainer.nativeElement;
    const scrollPosition = container.scrollTop + container.clientHeight;
    const bottom = container.scrollHeight;
    this.mostrarBotonBajar = (bottom - scrollPosition) > 100;
  }

  ngOnDestroy(): void {
    this.detenerPolling();
  }

  scrollToBottom() {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
    this.mostrarBotonBajar = false;
  }

  get filteredSolicitudes() {
    return this.solicitudes.filter(solicitud => {
      return (
        (!this.filtros.solicitante || solicitud.solicitante.toLowerCase().includes(this.filtros.solicitante.toLowerCase())) &&
        (!this.filtros.nombreMp || solicitud.nombreMp.toLowerCase().includes(this.filtros.nombreMp.toLowerCase())) &&
        (!this.filtros.proveedor || solicitud.proveedor.toLowerCase().includes(this.filtros.proveedor.toLowerCase())) &&
        (!this.filtros.estado || solicitud.estado.toLowerCase().includes(this.filtros.estado.toLowerCase()))
      );
    });
  }

  obtenerSolicitudes(): void {
    this.solicitudService.getSolicitudExpediciones().subscribe(
      (data: SolicitudMuestra[]) => {
        this.solicitudes = data;
      },
      error => console.error('Error al obtener solicitudes', error)
    );
  }

  obtenerSolicitudesAlmacen(): void {
    this.solicitudService.getSolicitudAlm().subscribe(
      (data: SolicitudMuestra[]) => {
        this.solicitudesAlmacen = data;
      },
      error => console.error('Error al obtener solicitudes', error)
    );
  }

  obtenerNombreToken(): string | null {
    return this.nombre = this.authService.getNameFromToken() || '';
  }

  cargarDetalles(solicitud: SolicitudMuestra): void {
    this.solicitudSeleccionada = solicitud;
    if (this.solicitudSeleccionada && this.solicitudSeleccionada.idSolicitudMuestra) {
      this.getFiles(this.solicitudSeleccionada.idSolicitudMuestra.toString());
      this.obtenerMensajes();
      this.iniciarPolling();
      this.obtenerNecesidadAlmacen(this.solicitudSeleccionada.idSolicitudMuestra);

    } else {
      console.error('ID de solicitud no está definido o es inválido en cargarDetalles.');
    }
  }

  obtenerMensajes(): void {
    if (this.solicitudSeleccionada?.idSolicitudMuestra) {
      this.mensajeService.getMensajes(this.solicitudSeleccionada.idSolicitudMuestra).subscribe(
        (mensajes: Mensaje[]) => {
          this.mensajes = mensajes;
          setTimeout(() => this.scrollToBottom(), 0);
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
          this.nuevoMensaje = '';
          this.obtenerMensajes();
        },
        error => {
          console.error('Error al enviar mensaje', error);
        }
      );
    } else {
      console.error('ID de solicitud no está definido o el mensaje está vacío.');
    }
  }

  iniciarPolling(): void {
    this.detenerPolling();
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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onUpload(): void {
    if (this.selectedFile && this.solicitudSeleccionada?.idSolicitudMuestra) {
      const id = this.solicitudSeleccionada.idSolicitudMuestra.toString();
      this.fileUploadService.uploadFile(this.selectedFile, id).subscribe(
        response => {
          this.getFiles(id);
        },
        error => {
          console.error('Error al subir el archivo', error);
        }
      );
    } else {
      console.error('Archivo o idSolicitudMuestra no están definidos');
    }
  }

  getFiles(idSolicitudMuestra: string): void {
    this.fileUploadService.getFiles(idSolicitudMuestra).subscribe(
      response => {
        this.archivos = response;
      },
      error => {
        console.error('Error al obtener los archivos', error);
      }
    );
  }

  eliminarArchivo(archivo: { id_archivo: number; url: string; idSolicitudMuestra: number }): void {
    const id = archivo.id_archivo;
    if (typeof id === 'number') {
      this.fileUploadService.deleteFile(id).subscribe(
        response => {
          const idSolicitud = this.solicitudSeleccionada?.idSolicitudMuestra?.toString();
          if (idSolicitud) {
            this.getFiles(idSolicitud);
          }
        },
        error => {
          console.error('Error al eliminar el archivo', error);
        }
      );
    } else {
      console.error('El ID proporcionado no es válido:', id);
    }
  }

  ngAfterViewChecked() {
    this.checkScrollPosition();
  }

  showAlmacenOptions: boolean = false;
  cantidadMuestra: string | undefined;


  enviarSolicitudAlmacen() {
    this.solicitudService.devolcerSolicitudLab(this.solicitudSeleccionada?.idSolicitudMuestra || 0).subscribe(
      (data) => {
        alert('Solicitud enviada devuelta a laboratorio');
        window.location.reload();
        this.showAlmacenOptions = false;
        this.obtenerSolicitudes();
        this.obtenerSolicitudesAlmacen();
      },
      (error) => {
        console.error('Error al enviar solicitud a almacén', error);
      }
    );

  }


  necesidadAlmacen: any = null;

  guardarDetallesAlmacen() {

  }
  obtenerNecesidadAlmacen(idSolicitudMuestra: number): void {
    this.solicitudService.getNecesidadAlmacen(idSolicitudMuestra).subscribe(
      (data) => {
        this.necesidadAlmacen = data;
      },
      (error) => {
        console.error('Error al obtener necesidad de almacén', error);
        this.necesidadAlmacen = null;
      }
    );
  }

  finalizar() {
    if (confirm('¿Está seguro de que desea finalizar esta solicitud?')) {
      this.solicitudService.finalizarSolcitud(this.solicitudSeleccionada?.idSolicitudMuestra || 0).subscribe(
        (data) => {
          alert('Solicitud finalizada');
          window.location.reload();
          this.showAlmacenOptions = false;
          this.obtenerSolicitudes();
          this.obtenerSolicitudesAlmacen();
        },
        (error) => {
          console.error('Error al finalizar solicitud', error);
        }
      );
    }
  }


}



