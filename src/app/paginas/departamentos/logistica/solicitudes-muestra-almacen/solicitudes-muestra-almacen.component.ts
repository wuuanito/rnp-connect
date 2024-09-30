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
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-solicitudes-muestra-almacen',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule, NgxPaginationModule,MatPaginator],
  templateUrl: './solicitudes-muestra-almacen.component.html',
  styleUrl: './solicitudes-muestra-almacen.component.css'
})
export class SolicitudesMuestraAlmacenComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  displayedColumns: string[] = ['solicitante', 'nombreMp', 'proveedor', 'estado'];

  // DataSource for each table
  dataSourceExpediciones = new MatTableDataSource<SolicitudMuestra>([]);
  dataSourceAlmacen = new MatTableDataSource<SolicitudMuestra>([]);

  solicitudSeleccionada: SolicitudMuestra | null = null;
  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  archivos: any[] = [];
  selectedFile: File | null = null;
  pollingSubscription: Subscription | undefined;
  mostrarBotonBajar: boolean = false;
  showAlmacenOptions: boolean = false;
  cantidadMuestra: string | undefined;
  necesidadAlmacen: any = null;

  // Variables de paginación
  pExpediciones: number = 1;
  pAlmacen: number = 1;
  itemsPerPage: number = 10;

  solicitudes: SolicitudMuestra[] = [];
  solicitudesAlmacen: SolicitudMuestra[] = [];

  // Filters for Expediciones
  filtrosExpediciones = {
    solicitante: '',
    nombreMp: '',
    proveedor: '',
    estado: ''
  };

  // Filters for Almacén
  filtrosAlmacen = {
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
    this.obtenerSolicitudesAlmacen();
  }

  private ordenarSolicitudes(solicitudes: SolicitudMuestra[]): SolicitudMuestra[] {
    return solicitudes.sort((a, b) => {
      // Definir el orden de prioridad de los estados
      const ordenEstados = {
        'Pendiente': 0,
        'En Laboratorio': 1,
        'En Almacén': 2,
        'En Expediciones': 3,
        'Completada': 4,
        'Finalizado': 5
      };

      // Comparar primero por estado
      if (ordenEstados[a.estado] !== ordenEstados[b.estado]) {
        return ordenEstados[a.estado] - ordenEstados[b.estado];
      }

      // Si los estados son iguales, ordenar por fecha (más reciente primero)
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });
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

  imprimirOGenerarPDF() {
    const confirmacion = confirm('¿Deseas generar un PDF o imprimir directamente?');
    if (confirmacion) {
      this.generarPDF();
    } else {
      this.imprimir();
    }
  }

  imprimirOGenerarPDFAlmacen() {
    const confirmacion = confirm('¿Deseas generar un PDF o imprimir directamente?');
    if (confirmacion) {
      this.generarPDFAlmacen();
    } else {
      this.imprimir();
    }
  }


  private imprimir() {
    window.print();
  }

  private generarPDF() {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  const logoPath = 'assets/imagenes/logo.png';

    const documentDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 60, 40, 60],
      header: (currentPage, pageCount, pageSize) => {
        return [
          {
            text: 'Departamento de Logística - Detalles de Solicitud',
            alignment: 'center',
            margin: [0, 20, 0, 0],
            fontSize: 16,
            bold: true
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 40,
                y1: 58,
                x2: pageSize.width - 40,
                y2: 58,
                lineWidth: 0.5
              }
            ]
          }
        ];
      },
      footer: (currentPage, pageCount) => {
        return {
          columns: [
            { text: 'Documento generado el ' + new Date().toLocaleString(), alignment: 'left', margin: [40, 0] },
            { text: 'Página ' + currentPage.toString() + ' de ' + pageCount, alignment: 'right', margin: [0, 0, 40, 0] }
          ],
          margin: [0, 20]
        };
      },
      content: [
        {
          columns: [
            {
              width: '50%',
              table: {
                headerRows: 1,
                widths: ['40%', '*'],
                body: [
                  [{ text: 'Campo', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }],
                  ['Solicitante', this.solicitudSeleccionada?.solicitante || ''],
                  ['Nombre del MP', this.solicitudSeleccionada?.nombreMp || ''],
                  ['Lote', this.solicitudSeleccionada?.lote || ''],
                  ['Proveedor', this.solicitudSeleccionada?.proveedor || ''],
                  ['Urgencia', this.solicitudSeleccionada?.urgencia || '']
                ]
              }
            },
            {
              width: '50%',
              table: {
                headerRows: 1,
                widths: ['40%', '*'],
                body: [
                  [{ text: 'Campo', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }],
                  ['Fecha', this.solicitudSeleccionada?.fecha ? new Date(this.solicitudSeleccionada.fecha).toLocaleDateString() : ''],
                  ['Estado', this.solicitudSeleccionada?.estado || ''],
                  ['Código Artículo', this.solicitudSeleccionada?.codigoArticulo || ''],
                  ['Comentarios', this.solicitudSeleccionada?.comentarios || ''],
                  ['', '']
                ]
              }
            }
          ]
        },

      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'white',
          fillColor: '#2c3e50'
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 5],
          color: '#34495e'
        }
      },
      defaultStyle: {
        fontSize: 10,
        color: '#2c3e50'
      }
    };

    pdfMake.createPdf(documentDefinition).open();
  }
  private generarPDFAlmacen() {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

    const documentDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 60, 40, 60],
      header: (currentPage, pageCount, pageSize) => {
        return [
          {
            text: 'Departamento de Logística - Detalles de Solicitud',
            alignment: 'center',
            margin: [0, 20, 0, 0],
            fontSize: 16,
            bold: true
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 40,
                y1: 58,
                x2: pageSize.width - 40,
                y2: 58,
                lineWidth: 0.5
              }
            ]
          }
        ];
      },
      footer: (currentPage, pageCount) => {
        return {
          columns: [
            { text: 'Documento generado el ' + new Date().toLocaleString(), alignment: 'left', margin: [40, 0] },
            { text: 'Página ' + currentPage.toString() + ' de ' + pageCount, alignment: 'right', margin: [0, 0, 40, 0] }
          ],
          margin: [0, 20]
        };
      },
      content: [
        {
          columns: [
            {
              width: '50%',
              table: {
                headerRows: 1,
                widths: ['40%', '*'],
                body: [
                  [{ text: 'Campo', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }],
                  ['Solicitante', this.solicitudSeleccionada?.solicitante || ''],
                  ['Nombre del MP', this.solicitudSeleccionada?.nombreMp || ''],
                  ['Lote', this.solicitudSeleccionada?.lote || ''],
                  ['Proveedor', this.solicitudSeleccionada?.proveedor || ''],
                  ['Urgencia', this.solicitudSeleccionada?.urgencia || '']
                ]
              }
            },
            {
              width: '50%',
              table: {
                headerRows: 1,
                widths: ['40%', '*'],
                body: [
                  [{ text: 'Campo', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }],
                  ['Fecha', this.solicitudSeleccionada?.fecha ? new Date(this.solicitudSeleccionada.fecha).toLocaleDateString() : ''],
                  ['Estado', this.solicitudSeleccionada?.estado || ''],
                  ['Código Artículo', this.solicitudSeleccionada?.codigoArticulo || ''],
                  ['Comentarios', this.solicitudSeleccionada?.comentarios || ''],
                  ['', '']
                ]
              }
            }
          ]
        },
        { text: 'Necesidad de Almacén', style: 'subheader', margin: [0, 20, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ['20%', '*'],
            body: [
              [{ text: 'Campo', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }],
              ['Necesidad', this.necesidadAlmacen?.necesidad || 'No especificada'],
              ['Estado', this.solicitudSeleccionada?.estadoAlmacen || 'No especificado'],
            ]
          }
        },
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'white',
          fillColor: '#2c3e50'
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 5],
          color: '#34495e'
        }
      },
      defaultStyle: {
        fontSize: 10,
        color: '#2c3e50'
      }
    };

    pdfMake.createPdf(documentDefinition).open();
  }
  scrollToBottom() {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
    this.mostrarBotonBajar = false;
  }

  get filteredSolicitudesExpediciones() {
    return this.ordenarSolicitudes(this.solicitudes.filter(solicitud => {
      return (
        (!this.filtrosExpediciones.solicitante || solicitud.solicitante.toLowerCase().includes(this.filtrosExpediciones.solicitante.toLowerCase())) &&
        (!this.filtrosExpediciones.nombreMp || solicitud.nombreMp.toLowerCase().includes(this.filtrosExpediciones.nombreMp.toLowerCase())) &&
        (!this.filtrosExpediciones.proveedor || solicitud.proveedor.toLowerCase().includes(this.filtrosExpediciones.proveedor.toLowerCase())) &&
        (!this.filtrosExpediciones.estado || solicitud.estado.toLowerCase().includes(this.filtrosExpediciones.estado.toLowerCase()))
      );
    }));
  }

  get filteredSolicitudesAlmacen() {
    return this.ordenarSolicitudes(this.solicitudesAlmacen.filter(solicitud => {
      return (
        (!this.filtrosAlmacen.solicitante || solicitud.solicitante.toLowerCase().includes(this.filtrosAlmacen.solicitante.toLowerCase())) &&
        (!this.filtrosAlmacen.nombreMp || solicitud.nombreMp.toLowerCase().includes(this.filtrosAlmacen.nombreMp.toLowerCase())) &&
        (!this.filtrosAlmacen.proveedor || solicitud.proveedor.toLowerCase().includes(this.filtrosAlmacen.proveedor.toLowerCase())) &&
        (!this.filtrosAlmacen.estado || solicitud.estado.toLowerCase().includes(this.filtrosAlmacen.estado.toLowerCase()))
      );
    }));
  }
  obtenerSolicitudes(): void {
    this.solicitudService.getSolicitudExpediciones().subscribe(
      (data: SolicitudMuestra[]) => {
        this.solicitudes = this.ordenarSolicitudes(data);
      },
      error => console.error('Error al obtener solicitudes', error)
    );
  }

  obtenerSolicitudesAlmacen(): void {
    this.solicitudService.getSolicitudAlm().subscribe(
      (data: SolicitudMuestra[]) => {
        this.solicitudesAlmacen = this.ordenarSolicitudes(data);
      },
      error => console.error('Error al obtener solicitudes', error)
    );
  }


  obtenerNombreToken(): string | null {
    return this.nombre = this.authService.getNameFromToken() || '';
  }

  cargarDetallesExpedicion(solicitud: SolicitudMuestra): void {
    this.solicitudSeleccionada = solicitud;
    if (this.solicitudSeleccionada && this.solicitudSeleccionada.idSolicitudMuestra) {
      this.getFiles(this.solicitudSeleccionada.idSolicitudMuestra.toString());
      this.obtenerMensajes();
      this.iniciarPolling();

    } else {
      console.error('ID de solicitud no está definido o es inválido en cargarDetallesExpedicion.');
    }
  }



  cargarDetallesAlmacen(solicitud: SolicitudMuestra): void {
    this.solicitudSeleccionada = solicitud;
    if (this.solicitudSeleccionada && this.solicitudSeleccionada.idSolicitudMuestra) {
      this.getFiles(this.solicitudSeleccionada.idSolicitudMuestra.toString());
      this.obtenerMensajes();
      this.iniciarPolling();
      this.obtenerNecesidadAlmacen(this.solicitudSeleccionada.idSolicitudMuestra);
    } else {
      console.error('ID de solicitud no está definido o es inválido en cargarDetallesAlmacen.');
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

  enviarSolicitudAlmacen(): void {
    if (this.solicitudSeleccionada?.idSolicitudMuestra) {
      this.solicitudService.devolcerSolicitudLab(this.solicitudSeleccionada.idSolicitudMuestra).subscribe(
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
    } else {
      console.error('ID de solicitud no está definido para enviar a almacén.');
    }
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

  finalizar(): void {
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

  resetFiltrosExpediciones(): void {
    this.filtrosExpediciones = {
      solicitante: '',
      nombreMp: '',
      proveedor: '',
      estado: ''
    };
    this.pExpediciones = 1;
  }

  resetFiltrosAlmacen(): void {
    this.filtrosAlmacen = {
      solicitante: '',
      nombreMp: '',
      proveedor: '',
      estado: ''
    };
    this.pAlmacen = 1;
  }



}
