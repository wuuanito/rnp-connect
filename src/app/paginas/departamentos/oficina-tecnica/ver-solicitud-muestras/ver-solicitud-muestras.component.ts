import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { MuestrasService } from '../../../../core/services/muestras.service';
import { Mensaje, SolicitudMuestra } from '../../../../core/interfaces/SolicitudMuestra';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MensajeService } from '../../../../core/services/mensaje.service';
import { FormsModule } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { UploadService } from '../../../../core/services/upload.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-ver-solicitud-muestras',
  standalone: true,
  imports: [DatePipe,CommonModule,FormsModule,NgxPaginationModule,NgbPaginationModule],
  templateUrl: './ver-solicitud-muestras.component.html',
  styleUrl: './ver-solicitud-muestras.component.css'
})
export class VerSolicitudMuestrasComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  solicitudes: SolicitudMuestra[] = [];
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
    this.aplicarFiltros();


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
  esUltimoMensajeDeOtroUsuario(solicitud: SolicitudMuestra): boolean {
    const mensajes = solicitud.mensajes;
    if (mensajes.length === 0) {
      return false; // No hay mensajes, no mostrar insignia
    }

    const ultimoMensaje = mensajes[mensajes.length - 1];
    const nombreUsuario = this.obtenerNombreToken();

    console.log("Remitente del último mensaje: ", ultimoMensaje.remitente);
    console.log("Nombre del usuario actual: ", nombreUsuario);

    return ultimoMensaje.remitente !== nombreUsuario;
  }



  obtenerSolicitudes(): void {
    this.solicitudService.getSolicitudes().subscribe(
      (data: SolicitudMuestra[]) => {
        this.solicitudes = data.map(solicitud => ({
          ...solicitud,
          mensajesNoLeidos: solicitud.mensajesNoLeidos ?? 0
        }));
        this.aplicarFiltros();
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
      this.marcarMensajesComoLeidos(this.solicitudSeleccionada.idSolicitudMuestra);
    }
  }

  marcarMensajesComoLeidos(idSolicitudMuestra: number): void {
    this.mensajeService.marcarMensajesComoLeidos(idSolicitudMuestra).subscribe(
      () => {
        const solicitud = this.solicitudes.find(s => s.idSolicitudMuestra === idSolicitudMuestra);
        if (solicitud) {
          solicitud.mensajesNoLeidos = 0;
        }
      },
      error => console.error('Error al marcar mensajes como leídos', error)
    );
  }


  obtenerMensajes(): void {
    if (this.solicitudSeleccionada?.idSolicitudMuestra) {
      this.mensajeService.getMensajes(this.solicitudSeleccionada.idSolicitudMuestra).subscribe(
        (mensajes: Mensaje[]) => {
          this.mensajes = mensajes;
          console.log('Mensajes obtenidos: ', mensajes); // Verifica que los mensajes se obtienen correctamente
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



  solicitudesFiltradas: any[] = [];

  // Variables para filtrado
  filtroSolicitante: string = '';
  filtroNombreMp: string = '';
  filtroEstado: string = '';

  // Variables para paginación
  p: number = 1; // página actual



  aplicarFiltros() {
    this.solicitudesFiltradas = this.solicitudes.filter(solicitud =>
      solicitud.solicitante.toLowerCase().includes(this.filtroSolicitante.toLowerCase()) &&
      solicitud.nombreMp.toLowerCase().includes(this.filtroNombreMp.toLowerCase()) &&
      (this.filtroEstado === '' || solicitud.estado === this.filtroEstado)
    );
  }

  formatearComentarios(comentarios: string): string {
    if (!comentarios) return '';

    // Reemplaza los saltos de línea por párrafos
    return comentarios.split('\n').map(parrafo => `<p>${parrafo}</p>`).join('');
  }

}



