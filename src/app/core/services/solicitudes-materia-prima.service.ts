import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Solicitud {
  id: number;
  fechaSolicitud: string;
  personaSolicita: string;
  nombreMateria: string;
  codigo: string;
  lote: string;
  proveedor: string;
  ubicacion: string;
  urgencia: string;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudesMateriaPrimaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener todas las solicitudes
  getSolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/solicitudes-materias-primas`);
  }

  // Obtener solicitud por ID
  getSolicitudById(id: number): Observable<Solicitud> {
    return this.http.get<Solicitud>(`${this.apiUrl}/solicitudes-materias-primas/${id}`);
  }

  // Crear una nueva solicitud
  createSolicitud(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(`${this.apiUrl}/solicitudes-materias-primas`, solicitud);
  }

  // Actualizar una solicitud
  updateSolicitud(id: number, solicitud: Solicitud): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.apiUrl}/solicitudes-materias-primas/${id}`, solicitud);
  }

  // Eliminar una solicitud
  deleteSolicitud(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/solicitudes-materias-primas/${id}`);
  }
}
