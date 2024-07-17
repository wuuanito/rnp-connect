import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Solicitud } from '../interfaces/solicitud.mode';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private apiUrl = 'http://192.168.11.19:4000/solicitudes';
  private cachedSolicitudes: Solicitud[] | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getSolicitudes(): Observable<Solicitud[]> {
    if (isPlatformServer(this.platformId)) {
      // En el servidor, siempre hacemos una nueva solicitud
      return this.fetchSolicitudes();
    }

    // En el cliente, usamos caché si está disponible
    if (this.cachedSolicitudes) {
      return of(this.cachedSolicitudes);
    } else {
      return this.fetchSolicitudes();
    }
  }

  private fetchSolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.apiUrl).pipe(
      tap(solicitudes => this.cachedSolicitudes = solicitudes),
      catchError(error => {
        console.error('Error fetching solicitudes', error);
        return of([]);
      })
    );
  }
}
