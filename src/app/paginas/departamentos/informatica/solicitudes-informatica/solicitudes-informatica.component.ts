import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Solicitud } from '../../../../core/interfaces/solicitud.mode';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EventService } from '../../../../core/events/events.service';

@Component({
  selector: 'app-solicitudes-informatica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudes-informatica.component.html',
  styleUrl: './solicitudes-informatica.component.css'
})
export class SolicitudesInformaticaComponent implements OnInit, OnDestroy {
  solicitudes: Solicitud[] = [];
  solicitudesFiltradas: Solicitud[] = [];
  private socket$: BehaviorSubject<Socket | null> = new BehaviorSubject<Socket | null>(null);

  tipoFiltro: string = '';
  estadoFiltro: string = '';

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
      const socket = io('http://192.168.11.19:4000', {
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
        this.solicitudesFiltradas = this.solicitudes;
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
    this.solicitudesFiltradas = this.solicitudes.filter(solicitud =>
      (this.tipoFiltro === '' || solicitud.tipo === this.tipoFiltro) &&
      (this.estadoFiltro === '' || solicitud.estado === this.estadoFiltro)
    );
    this.actualizarResumen();
  }

  actualizarResumen(): void {
    this.resumen.total = this.solicitudesFiltradas.length;
    this.resumen.enviadas = this.solicitudesFiltradas.filter(s => s.tipo === 'Estado').length;
    this.resumen.recibidas = this.solicitudesFiltradas.filter(s => s.tipo === 'Recibida').length;
  }

  nuevaSolicitud(): void {
    console.log('Crear nueva solicitud');
  }
}
