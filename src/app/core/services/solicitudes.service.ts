import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Solicitud } from '../interfaces/solicitud.mode';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { environment } from '../../../environments/environment';
import { NotificationBuenaService } from './notification-buena.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private apiUrl = environment.apiUrl;

  private cachedSolicitudes: Solicitud[] | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private notificacionService : NotificationBuenaService,
    private authService: AuthService

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
    return this.http.get<Solicitud[]>(`${this.apiUrl}/solicitudes`).pipe(
      tap(solicitudes => this.cachedSolicitudes = solicitudes),
      catchError(error => {
        console.error('Error fetching solicitudes', error);
        return of([]);
      })
    );
  }

  getSolicitudById(id_solicitud: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/solicitudes/${id_solicitud}`);
  }

  createSolicitud(solicitudData: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(`${this.apiUrl}/solicitudes`, solicitudData).pipe(
      tap((newSolicitud: Solicitud) => {
        if (this.cachedSolicitudes) {
          this.cachedSolicitudes.push(newSolicitud);
        }
        // Obtener rol del usuario actual
        const userRole = this.authService.getRoleFromToken();
        if (userRole) {
          // Enviar notificación a usuarios con el rol adecuado
          this.notificacionService.sendNotificationToRole(
            `Nueva solicitud creada: ${newSolicitud.nombre_solicitud}`,
            'nueva',
            userRole
          );
        }
      }),
      catchError(error => {
        console.error('Error creating solicitud', error);
        return of(null as any);
      })
    );
  }
  updateSolicitud(solicitudData: Solicitud): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.apiUrl}/solicitudes/${solicitudData.id_solicitud}`, solicitudData).pipe(
      tap(updatedSolicitud => {
        if (this.cachedSolicitudes) {
          const index = this.cachedSolicitudes.findIndex(solicitud => solicitud.id_solicitud === updatedSolicitud.id_solicitud);
          if (index !== -1) {
            this.cachedSolicitudes[index] = updatedSolicitud;
          }
        }
        // Obtener rol del usuario actual
        const userRole = this.authService.getRoleFromToken();
        if (userRole) {
          // Enviar notificación a usuarios con el rol adecuado
          this.notificacionService.sendNotificationToRole(
            `Solicitud actualizada: ${updatedSolicitud.nombre_solicitud}`,
            'actualizada',
            userRole
          );
        }
      }),
      catchError(error => {
        console.error('Error updating solicitud', error);
        return of(null as any);
      })
    );
  }

}
