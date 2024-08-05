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
import { NgxPaginationModule } from 'ngx-pagination';
import bootstrap from 'bootstrap';

@Component({
  selector: 'app-ver-solicitud-muestras-lab',
  standalone: true,
  imports: [DatePipe,CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './ver-solicitud-muestras-lab.component.html',
  styleUrl: './ver-solicitud-muestras-lab.component.css'
})
export class VerSolicitudMuestrasLabComponent implements OnInit  {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  solicitudes: SolicitudMuestra[] = [];
  solicitudSeleccionada: SolicitudMuestra | null = null;
  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  pollingSubscription: Subscription | undefined;
  files: any[] = []; // Arreglo para almacenar los archivos
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
    private fileUploadService:UploadService
  ) {}

  nombre = this.authService.getNameFromToken() || '';

  ngOnInit(): void {
    this.obtenerSolicitudes();
    this.nombre = this.authService.getNameFromToken() || '';

  }



  checkScrollPosition() {
    const container = this.chatContainer.nativeElement;
    const scrollPosition = container.scrollTop + container.clientHeight;
    const bottom = container.scrollHeight;

    // Si está cerca del final, ocultar el botón
    this.mostrarBotonBajar = (bottom - scrollPosition) > 100;
  }

  ngOnDestroy(): void {
    this.detenerPolling();
  }
  scrollToBottom() {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
    this.mostrarBotonBajar = false; // Ocultar el botón después de desplazar
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
    this.solicitudService.getSolicitudLab().subscribe(
      (data: SolicitudMuestra[]) => {
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
          this.checkScrollPosition();

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


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onUpload(): void {
    if (this.selectedFile && this.solicitudSeleccionada?.idSolicitudMuestra) {
      const id = this.solicitudSeleccionada.idSolicitudMuestra.toString(); // Convert idSolicitudMuestra to string
      this.fileUploadService.uploadFile(this.selectedFile, id)
        .subscribe(
          response => {
            this.getFiles(id); // Update the list of files after upload
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
    this.fileUploadService.getFiles(idSolicitudMuestra)
      .subscribe(
        response => {
          this.archivos = response;
          console.log('Archivos obtenidos exitosamente', response);
        },
        error => {
          console.error('Error al obtener los archivos', error);
        }
      );
  }


  //Metodo eliminarArchivo segun el id que paso por parametro del archivo

  eliminarArchivo(archivo: { id_archivo: number; url: string; idSolicitudMuestra: number }): void {
    const id = archivo.id_archivo; // Extrae el ID del archivo del objeto

    console.log('ID del archivo a eliminar:', id); // Verifica el valor del ID

    if (typeof id === 'number') {
      this.fileUploadService.deleteFile(id)
        .subscribe(
          response => {
            console.log('Archivo eliminado exitosamente', response);
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
  toggleAlmacenOptions() {
    this.showAlmacenOptions = !this.showAlmacenOptions;
  }



  //funcion para enviar la solicitud al almacen pasando el id de la solicitudSeleccionada
  enviarSolicitudAlmacen() {
    if (this.solicitudSeleccionada && this.solicitudSeleccionada.idSolicitudMuestra && this.cantidadMuestra) {
      const data = {
        idSolicitudMuestra: this.solicitudSeleccionada.idSolicitudMuestra,
        necesidad: this.cantidadMuestra
      };

      // Paso 1: Crear la solicitud al almacén
      this.solicitudService.createMuestrasNecesidadAlmacen(data).subscribe(
        response => {
          console.log('Solicitud enviada al almacén con éxito', response);

          // Paso 2: Actualizar el estado de la solicitud
          const idSolicitudMuestra = this.solicitudSeleccionada?.idSolicitudMuestra;

          // Verificar que idSolicitudMuestra no sea undefined
          if (idSolicitudMuestra !== undefined) {
            const datosActualizados = { almacen: true };

            this.solicitudService.updateSolicitudAlmacen(idSolicitudMuestra, datosActualizados).subscribe(
              updateResponse => {
                console.log('Estado de la solicitud actualizado con éxito', updateResponse);
                // Aquí puedes agregar lógica adicional, como mostrar un mensaje de éxito
                this.showAlmacenOptions = false; // Ocultar las opciones de almacén
                this.cantidadMuestra = ''; // Limpiar el campo
                alert('Solicitud enviada al almacén con éxito');
                window.location.reload();
              },
              updateError => {
                console.error('Error al actualizar el estado de la solicitud', updateError);
                // Aquí puedes agregar lógica para manejar el error, como mostrar un mensaje al usuario
              }
            );
          } else {
            console.error('ID de solicitud no definido');
            // Aquí puedes agregar lógica para manejar el caso en que el ID no está definido
          }
        },
        error => {
          console.error('Error al enviar la solicitud al almacén', error);
          // Aquí puedes agregar lógica para manejar el error, como mostrar un mensaje al usuario
        }
      );
    } else {
      console.error('Falta información necesaria para enviar la solicitud al almacén');
      // Aquí puedes agregar lógica para informar al usuario que falta información
    }
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

//funcion finalizar para finalizar la solicitud de la muestra

finalizar(){

  this.solicitudService.enviarSolicitudExpediciones(this.solicitudSeleccionada?.idSolicitudMuestra || 0).subscribe(
    (data) => {
      console.log('Solicitud enviada a expediciones', data);
      alert('Solicitud enviada a expediciones');
      window.location.reload();
      this.obtenerSolicitudes();
    },
    (error) => {
      console.error('Error al enviar solicitud a expediciones', error);
    }
  );

  }

}



