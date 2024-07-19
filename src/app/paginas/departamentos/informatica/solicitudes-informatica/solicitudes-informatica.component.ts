import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Solicitud } from '../../../../core/interfaces/solicitud.mode';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EventService } from '../../../../core/events/events.service';
import { ModalsolicitudesComponent } from "../../../../modals/modalsolicitudes/modalsolicitudes.component";
import bootstrap from '../../../../../main.server';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-solicitudes-informatica',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalsolicitudesComponent],
  templateUrl: './solicitudes-informatica.component.html',
  styleUrl: './solicitudes-informatica.component.css'
})
export class SolicitudesInformaticaComponent implements OnInit, OnDestroy {
  solicitudes: Solicitud[] = [];
  solicitudesFiltradas: Solicitud[] = [];
  private socket$: BehaviorSubject<Socket | null> = new BehaviorSubject<Socket | null>(null);
  departamentoActual: number = 1; // Asume que el departamento actual es 1
  solicitudesRecibidas: Solicitud[] = [];
  solicitudesEnviadas: Solicitud[] = [];
  currentView: 'recibidas' | 'enviadas' = 'recibidas';

  tipoFiltro: string = '';
  estadoFiltro: string = ''

  resumen = {
    total: 0,
    enviadas: 0,
    recibidas: 0
  };

  constructor(
    private solicitudesService: SolicitudesService,
    private eventService: EventService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudes().subscribe();

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.inicializarSocket()
          .pipe(
            tap(() => this.escucharNuevasSolicitudes())
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
      const socket = io('http://localhost:3000', {
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
  private escucharNuevasSolicitudes(): void {
    const socket = this.socket$.getValue();
    if (socket) {
      socket.on('nuevaSolicitud', (nuevaSolicitud: Solicitud) => {
        this.solicitudes.push(nuevaSolicitud);
        this.aplicarFiltros();
        this.eventService.emitNuevaSolicitud(nuevaSolicitud);
      });
    }
  }
  aplicarFiltros(): void {
    this.solicitudesRecibidas = this.solicitudes.filter(solicitud =>
      solicitud.enviado_por !== this.departamentoActual &&
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

  actualizarResumen(): void {
    this.resumen.recibidas = this.solicitudesRecibidas.length;
    this.resumen.enviadas = this.solicitudesEnviadas.length;
    this.resumen.total = this.resumen.recibidas + this.resumen.enviadas;
  }



  nuevaSolicitud(): void {
    console.log('Crear nueva solicitud');
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
  submitSolicitud(form: NgForm) {

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

}
