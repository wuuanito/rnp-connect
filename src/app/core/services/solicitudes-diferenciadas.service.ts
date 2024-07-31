import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { Solicitud } from '../interfaces/solicitud.mode';
@Injectable({
  providedIn: 'root'
})
export class SolicitudesDiferenciadasService {

  private apiUrl = 'http://192.168.11.19:4000/solicitudes';
  private cachedSolicitudesRecibidas: Solicitud[] | null = null;
  private cachedSolicitudesEnviadas: Solicitud[] | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  getSolicitudesRecibidas(enviado_a: string): Observable<Solicitud[]> {
    if (isPlatformServer(this.platformId)) {
      return this.fetchSolicitudes('recibidas', enviado_a);
    }

    if (this.cachedSolicitudesRecibidas) {
      return of(this.cachedSolicitudesRecibidas);
    } else {
      return this.fetchSolicitudes('recibidas', enviado_a);
    }
  }



  private fetchSolicitudes(tipo: 'recibidas' | 'enviadas', enviado_a: string): Observable<Solicitud[]> {
    const url = `${this.apiUrl}/${tipo}/${enviado_a}`;
    return this.http.get<Solicitud[]>(url).pipe(
      tap(solicitudes => {
        if (tipo === 'recibidas') {
          this.cachedSolicitudesRecibidas = solicitudes;
        }
      }),
      catchError(error => {
        console.error(`Error fetching ${tipo} solicitudes`, error);
        return of([]);
      })
    );
  }


  // Método para limpiar el caché si es necesario
  clearCache(): void {
    this.cachedSolicitudesRecibidas = null;
    this.cachedSolicitudesEnviadas = null;
  }




}
