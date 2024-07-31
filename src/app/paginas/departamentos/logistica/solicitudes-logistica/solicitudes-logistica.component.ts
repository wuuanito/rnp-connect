import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Solicitud } from '../../../../core/interfaces/solicitud.mode';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EventService } from '../../../../core/events/events.service';
import bootstrap from '../../../../../main.server';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-solicitudes-logistica',
  standalone: true,
  imports: [CommonModule, FormsModule,NgxPaginationModule],
  templateUrl: './solicitudes-logistica.component.html',
  styleUrl: './solicitudes-logistica.component.css'
})
export class SolicitudesLogisticaComponent implements OnInit, OnDestroy {
  pageRecibidas: number = 1;
  pageEnviadas: number = 1;
  private apiUrl = environment.apiUrl;


  departamentoMap: { [key: number]: string } = {
    1: "INFORMATICA",
    2: "COMPRAS",
    3: "GERENCIA",
    4: "ADMINISTRACION",
    5: "LOGISTICA",
    6: "MANTENIMIENTO",
    7: "OFICINA TECNICA",
    8: "RRHH",
    9: "LABORATORIO/CALIDAD",
    10: "PRODUCCION"
  };

  getNombreDepartamento(id: number): string {
    return this.departamentoMap[id] || 'Desconocido'; // Valor predeterminado en caso de que el id no esté en el mapeo
  }

  solicitudes: Solicitud[] = [];
  solicitudesFiltradas: Solicitud[] = [];
  private socket$: BehaviorSubject<Socket | null> = new BehaviorSubject<Socket | null>(null);
  departamentoActual: number = 5; // Asume que el departamento actual es 2 (Compras) por defecto
  solicitudesRecibidas: Solicitud[] = [];
  solicitudesEnviadas: Solicitud[] = [];
  currentView: 'recibidas' | 'enviadas' = 'recibidas';

  tipoFiltro: string = '';
  estadoFiltro: string = '';

  resumen = {
    total: 0,
    enviadas: 0,
    recibidas: 0
  };

  constructor(
    private authService: AuthService,
    private solicitudesService: SolicitudesService,
    private eventService: EventService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
   email = this.authService.getEmailFromToken();

  ngOnInit(): void {
    this.cargarSolicitudes().subscribe();

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.inicializarSocket()
          .pipe(
            tap(() => this.escucharSolicitudes())
          )
          .subscribe();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.desconectarSocket();
  }

  private inicializarSocket(): Observable<void | null> {
    return new Observable<void>(observer => {
      const socket = io(`${this.apiUrl}`
, {
        transports: ['websocket'],
        timeout: 10000
      });

      socket.on('connect', () => {
        console.log('Socket conectado');
        this.socket$.next(socket);
        observer.next();
        observer.complete();
      });

      socket.on('connect_error', (error) => {
        console.error('Error de conexión del socket:', error);
        observer.error(error);
      });
    }).pipe(
      catchError(error => {
        console.error('Error al inicializar el socket:', error);
        return of(null);
      })
    );
  }

  private desconectarSocket(): void {
    const socket = this.socket$.getValue();
    if (socket) {
      socket.disconnect();
    }
    this.socket$.next(null);
  }

  private cargarSolicitudes(): Observable<Solicitud[]> {
    return from(this.solicitudesService.getSolicitudes()).pipe(
      tap(data => {
        this.solicitudes = data;
        this.aplicarFiltros();
      }),
      catchError(error => {
        console.error('Error fetching solicitudes', error);
        return of([]);
      })
    );
  }

  private escucharSolicitudes(): void {
    const socket = this.socket$.getValue();
    if (socket) {
      socket.on('nuevaSolicitud', (nuevaSolicitud: Solicitud) => {
        this.solicitudes.push(nuevaSolicitud);
        this.aplicarFiltros();
        this.eventService.emitNuevaSolicitud(nuevaSolicitud);
      });

      socket.on('actualizacionSolicitud', (updatedSolicitud: Solicitud) => {
        const index = this.solicitudes.findIndex(solicitud => solicitud.id_solicitud === updatedSolicitud.id_solicitud);
        if (index !== -1) {
          this.solicitudes[index] = updatedSolicitud;
          this.aplicarFiltros();
        }
      });
    }
  }

  aplicarFiltros(): void {
    this.solicitudesRecibidas = this.solicitudes.filter(solicitud =>
      solicitud.enviado_a === this.departamentoActual &&
      (this.tipoFiltro === '' || solicitud.tipo === this.tipoFiltro) &&
      (this.estadoFiltro === '' || solicitud.estado === this.estadoFiltro)
    );

    this.solicitudesEnviadas = this.solicitudes.filter(solicitud =>
      solicitud.enviado_por === this.departamentoActual &&
      (this.tipoFiltro === '' || solicitud.tipo === this.tipoFiltro) &&
      (this.estadoFiltro === '' || solicitud.estado === this.estadoFiltro)
    );

    this.actualizarResumen();
  }

  searchQuery: string = '';

  aplicarBusqueda(): void {
    if (this.searchQuery) {
      this.solicitudesRecibidas = this.solicitudesRecibidas.filter(solicitud =>
        solicitud.nombre_solicitud.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      this.solicitudesEnviadas = this.solicitudesEnviadas.filter(solicitud =>
        solicitud.nombre_solicitud.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.aplicarFiltros(); // Re-aplica los filtros si la búsqueda está vacía
    }
  }

  actualizarResumen(): void {
    this.resumen.recibidas = this.solicitudesRecibidas.length;
    this.resumen.enviadas = this.solicitudesEnviadas.length;
    this.resumen.total = this.resumen.recibidas + this.resumen.enviadas;
  }

  selectedSolicitud: Solicitud | null = null;

  openModal(solicitudId: number) {
    this.selectedSolicitud = null;
    this.solicitudesService.getSolicitudById(solicitudId).subscribe(data => {
      this.selectedSolicitud = data;
    }, error => {
      console.error('Error al obtener la solicitud', error);
    });
  }

  mensaje: string | null = null; // Para manejar el mensaje de alerta
  cargando: boolean = false;
  mensajeExito: string | null = null;
  submitSolicitud(form: NgForm) {
    if (form.valid) {
      this.cargando = true;
      this.mensajeExito = null;

      const solicitudData: Solicitud = {
        id_solicitud: 0,
        nombre_solicitud: form.value.nombre_solicitud,
        fecha: new Date().toISOString().split('T')[0],
        tipo: form.value.tipo,
        prioridad: form.value.prioridad,
        descripcion: form.value.descripcion,
        id_departamento: this.departamentoActual,
        enviado_por: 5,
        enviado_a: form.value.enviado_a,
        estado: 'Pendiente',
        respuesta: '',
        email: this.email ?? ''
      };

      this.solicitudesService.createSolicitud(solicitudData).subscribe(
        (newSolicitud) => {
          console.log('Solicitud creada exitosamente', newSolicitud);
          this.cargando = false;
          this.mensajeExito = 'Solicitud enviada con éxito';

          // Cerrar el modal si está abierto


          // Recargar la página después de un breve retraso
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        error => {
          console.error('Error al crear la solicitud', error);
          this.cargando = false;
          // Aquí podrías manejar el error si lo deseas
        }
      );
    }
  }

  setView(view: 'recibidas' | 'enviadas') {
    this.currentView = view;
    this.aplicarFiltros();
  }

  getTipoSolicitud(solicitud: Solicitud): string {
    return solicitud.enviado_por === this.departamentoActual ? 'Enviada' : 'Recibida';
  }

  esSolicitudEnviada(solicitud: Solicitud): boolean {
    return solicitud.enviado_por === this.departamentoActual;
  }

  openModalRecibida(solicitudId: number) {
    this.selectedSolicitud = null;
    this.solicitudesService.getSolicitudById(solicitudId).subscribe(
      data => {
        this.selectedSolicitud = data;
        // Aquí puedes agregar lógica adicional específica para solicitudes recibidas
        console.log('Abriendo modal de solicitud recibida:', this.selectedSolicitud);
      },
      error => {
        console.error('Error al obtener la solicitud recibida', error);
      }
    );
  }

  openModalEnviada(solicitudId: number) {
    this.selectedSolicitud = null;
    this.solicitudesService.getSolicitudById(solicitudId).subscribe(
      data => {
        this.selectedSolicitud = data;
        // Aquí puedes agregar lógica adicional específica para solicitudes enviadas
        console.log('Abriendo modal de solicitud enviada:', this.selectedSolicitud);
      },
      error => {
        console.error('Error al obtener la solicitud enviada', error);
      }
    );
  }

  guardarCambios() {
    if (this.selectedSolicitud) {
      this.cargando = true;
      this.mensajeExito = null;

      this.solicitudesService.updateSolicitud(this.selectedSolicitud).subscribe(
        updatedSolicitud => {
          if (updatedSolicitud) {
            console.log('Solicitud actualizada exitosamente');
            this.cargando = false;
            this.mensajeExito = 'Enviado';

            // Recargar la página después de un breve retraso
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            console.error('No se pudo actualizar la solicitud');
            this.cargando = false;
          }
        },
        error => {
          console.error('Error al actualizar la solicitud', error);
          this.cargando = false;
        }
      );
    } else {
      console.error('No hay solicitud seleccionada para actualizar');
    }
  }
}
