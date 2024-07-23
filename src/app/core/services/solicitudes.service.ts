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
  private apiUrl = 'http://localhost:3000/solicitudes';
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

  getSolicitudById(id_solicitud: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id_solicitud}`);
  }

  createSolicitud(solicitudData: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(this.apiUrl, solicitudData).pipe(
      tap((newSolicitud: Solicitud) => {
        // Si hay caché, agregamos la nueva solicitud a la caché
        if (this.cachedSolicitudes) {
          this.cachedSolicitudes.push(newSolicitud);
        }
      }),
      catchError(error => {
        console.error('Error creating solicitud', error);
        return of(null as any);
      })
    );
  }

  updateSolicitud(solicitudData: Solicitud): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.apiUrl}/${solicitudData.id_solicitud}`, solicitudData).pipe(
      tap(updatedSolicitud => {
        // Si hay caché, actualizamos la solicitud en la caché
        if (this.cachedSolicitudes) {
          const index = this.cachedSolicitudes.findIndex(solicitud => solicitud.id_solicitud === updatedSolicitud.id_solicitud);
          if (index !== -1) {
            this.cachedSolicitudes[index] = updatedSolicitud;
          }
        }
      }),
      catchError(error => {
        console.error('Error updating solicitud', error);
        return of(null as any);
      })
    );
  }


}
