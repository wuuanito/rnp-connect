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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-ver-solicitud-muestras-lab',
  standalone: true,
  imports: [DatePipe,CommonModule,FormsModule,NgxPaginationModule,MatTooltipModule],
  templateUrl: './ver-solicitud-muestras-lab.component.html',
  styleUrl: './ver-solicitud-muestras-lab.component.css'
})
export class VerSolicitudMuestrasLabComponent implements OnInit  {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  tooltips = {
    expediciones: 'Project Manager → Expediciones',
    laboratorio: 'Project Manager → Laboratorio (laboratorio → Almacén (si es necesario) → Project Manager))',
    almacen: 'Project Manager → Almacén → Project Manager'
  };
  solicitudes: SolicitudMuestra[] = [];
  solicitudSeleccionada: SolicitudMuestra | null = null;
  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  pollingSubscription: Subscription | undefined;
  files: any[] = [];
  page: number = 1;
  pageLab: number = 1;
  itemsPerPage: number = 10;
  mostrarBotonBajar: boolean = false;

  // Filtros
  filtros = {
    solicitante: '',
    nombreMp: '',
    proveedor: '',
    estado: ''
  };
  // Filtros
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
  solicitudSoloLab: SolicitudMuestra = {
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

  constructor(
    private solicitudService: MuestrasService,
    private mensajeService: MensajeService,
    private authService: AuthService,
    private fileUploadService: UploadService
  ) {}
  mostrarInformes: boolean = false; // Inicializa la variable para controlar la visibilidad de los informes
  mostrarCreacion: boolean = false; // Inicializa la variable para controlar la visibilidad de los informes
  selectedLaboratorioOption: string = ''; // Almacena la opción del desplegable

  onSubmit() {
    console.log('Opción seleccionada del laboratorio:', this.selectedLaboratorioOption); // Verifica el valor aquí

    const solicitudParaCrear = {
        ...this.solicitud,
        selectedLaboratorioOption: this.selectedLaboratorioOption,
        idSolicitudMuestra: undefined
    };

    this.solicitudService.createSolicitudLabAlm(solicitudParaCrear).subscribe({
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
selectedOption: string = 'almacen';  // Inicializamos con 'almacen' para que esté seleccionado por defecto

  nombre = this.authService.getNameFromToken() || '';
  ngOnInit(): void {
    this.obtenerSolicitudes();
    this.obtenerSolicitudesAlmacen();
    this.obtenerSolicitudesSoloLab(); // Agregamos los paréntesis
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

  fechaDesde: string = '';
  fechaHasta: string = '';
  informeData: SolicitudMuestra[] = [];
  loading: boolean = false;
  error: string = '';
  today: string = new Date().toISOString().split('T')[0];
  generarInforme(): void {
    if (!this.fechaDesde || !this.fechaHasta) {
        this.error = 'Por favor, seleccione ambas fechas';
        return;
    }

    this.loading = true;
    this.error = '';
    this.informeData = [];

    this.solicitudService.generarInformeLaboratorio(this.fechaDesde, this.fechaHasta)
        .subscribe({
            next: (response: { message: string; data: SolicitudMuestra[] }) => {
                this.informeData = response.data; // Asegúrate de acceder a `data`
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error al generar el informe. Por favor, intente nuevamente.';
                this.loading = false;
                console.error('Error:', error);
            }
        });
}


  checkScrollPosition() {
    const container = this.chatContainer.nativeElement;
    const scrollPosition = container.scrollTop + container.clientHeight;
    const bottom = container.scrollHeight;

    // Si está cerca del final, ocultar el botón
    this.mostrarBotonBajar = (bottom - scrollPosition) > 100;
  }

  generarPDF(): void {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Informe de Solicitudes de Laboratorio', 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30); // Agregar fecha actual

    // Tabla
    autoTable(doc, {
      head: [[ 'Fecha', 'Tipo Análisis', 'Nombre MP','Lote','Proveedor']], // Agregar columna de Estado
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255], fontSize: 12 }, // Estilo de encabezado
      body: this.informeData.map(solicitud => [
        new Date(solicitud.fecha).toLocaleString(),
        solicitud.tipoAnalisis ?? '',
        solicitud.nombreMp,
        solicitud.lote,
        solicitud.proveedor
      ]),
      startY: 40,
      styles: { fontSize: 10, cellPadding: 5, overflow: 'linebreak' }, // Estilo de celdas
      theme: 'grid', // Estilo de tabla
    });

    // Guardar el PDF
    doc.save(`Informe de Solicitudes de Laboratorio - ${this.fechaDesde} a ${this.fechaHasta}.pdf`);
}

  crearSolicitudAlmacen(): void {
    // Aquí se implementaría la lógica para crear una solicitud al almacén
    console.log('Crear solicitud al almacén');
  }


// Generar Excel
generarExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.informeData.map(solicitud => ({
        Fecha: new Date(solicitud.fecha).toLocaleString(),
        'Tipo Análisis': solicitud.tipoAnalisis,
        'Nombre MP': solicitud.nombreMp,
        'Lote': solicitud.lote,
        'Proveedor': solicitud.proveedor
    })));

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Solicitudes');

    // Guardar el archivo Excel
    XLSX.writeFile(workbook, `Informe de Solicitudes de Laboratorio - ${this.fechaDesde} a ${this.fechaHasta}.xlsx`);
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
        solicitud.solicitante.toLowerCase().includes(this.filtros.solicitante.toLowerCase()) &&
        solicitud.nombreMp.toLowerCase().includes(this.filtros.nombreMp.toLowerCase()) &&
        solicitud.proveedor.toLowerCase().includes(this.filtros.proveedor.toLowerCase()) &&
        (this.filtros.estado === '' || solicitud.estado.toLowerCase() === this.filtros.estado.toLowerCase())
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
        if (data) {
          this.necesidadAlmacen = data;
          this.showAlmacenOptions = false; // Ocultar las opciones si ya hay una necesidad
        } else {
          this.necesidadAlmacen = null;
        }
      },
      (error) => {
        console.error('Error al obtener necesidad de almacén', error);
        this.necesidadAlmacen = null;
      }
    );
  }
  mostrarMensaje() {
    alert('No se puede enviar a Project Manager si no se ha devuelto de almacén');
  }

//funcion finalizar para finalizar la solicitud de la muestra
pageLaboratorio: number = 1;
pageAlmacen: number = 1;
pageSoloLab: number = 1;

finalizar(){

  this.solicitudService.devolveraPm(this.solicitudSeleccionada?.idSolicitudMuestra || 0).subscribe(
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


  solicitudesAlmacen: SolicitudMuestra[] = [];
  filtrosAlmacen = {
    solicitante: '',
    nombreMp: '',
    proveedor: '',
    estado: ''
  };

  solicitudesSoloLab: SolicitudMuestra[] = [];
  filtrosSoloLab = {
    solicitante: '',
    nombreMp: '',
    proveedor: '',
    estado: ''
  };
  obtenerSolicitudesAlmacen(): void {
    this.solicitudService.getSolicitudLab().subscribe(
      (data: SolicitudMuestra[]) => {
        this.solicitudesAlmacen = data;
      },
      error => console.error('Error al obtener solicitudes de almacén', error)
    );
  }

  obtenerSolicitudesSoloLab(): void {
    this.solicitudService.getSolicitudesSoloLab().subscribe(
      (data: SolicitudMuestra[]) => {
        this.solicitudesSoloLab = data; // Corregimos la asignación
      },
      error => console.error('Error al obtener solicitudes de solo laboratorio', error)
    );
  }

  get filteredSolicitudesAlmacen() {
    return this.solicitudesAlmacen.filter(solicitud => {
      return (
        solicitud.solicitante.toLowerCase().includes(this.filtrosAlmacen.solicitante.toLowerCase()) &&
        solicitud.nombreMp.toLowerCase().includes(this.filtrosAlmacen.nombreMp.toLowerCase()) &&
        solicitud.proveedor.toLowerCase().includes(this.filtrosAlmacen.proveedor.toLowerCase()) &&
        (this.filtrosAlmacen.estado === '' || solicitud.estado.toLowerCase() === this.filtrosAlmacen.estado.toLowerCase())
      );
    });
  }
  tablaSeleccionada: string = 'muestras';  // Inicializar con 'muestras' como valor predeterminado

  get filteredSolicitudesSoloLab() {
    return this.solicitudesSoloLab.filter(solicitud => {
      return (
        solicitud.solicitante.toLowerCase().includes(this.filtrosSoloLab.solicitante.toLowerCase()) &&
        solicitud.nombreMp.toLowerCase().includes(this.filtrosSoloLab.nombreMp.toLowerCase()) &&
        solicitud.proveedor.toLowerCase().includes(this.filtrosSoloLab.proveedor.toLowerCase()) &&
        (this.filtrosSoloLab.estado === '' || solicitud.estado.toLowerCase() === this.filtrosSoloLab.estado.toLowerCase())
      );
    });
  }

  // Método modificado para cargar detalles según el origen
  onPageChangeLab(page: number): void {
    this.pageLab = page;
    this.paginationConfigLab.currentPage = page;
  }

  onPageChangeAlmacen(page: number): void {
    this.pageAlmacen = page;
    this.paginationConfigAlmacen.currentPage = page;
  }

  onPageChangeSoloLab(page: number): void {
    this.pageSoloLab = page;
    this.paginationConfigSoloLab.currentPage = page;
  }

  paginationConfigLab = {
    id: 'paginationLab',
    itemsPerPage: 10,
    currentPage: 1
  };

  paginationConfigAlmacen = {
    id: 'paginationAlmacen',
    itemsPerPage: 10,
    currentPage: 1
  };

  paginationConfigSoloLab = {
    id: 'paginationSoloLab',
    itemsPerPage: 10,
    currentPage: 1
  };

}



