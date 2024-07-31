import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitudMuestra } from '../interfaces/SolicitudMuestra';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MuestrasService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getSolicitudes(): Observable<SolicitudMuestra[]> {
    return this.http.get<SolicitudMuestra[]>(`${this.apiUrl}/solicitudMuestras`);
  }

  createSolicitud(solicitud: SolicitudMuestra): Observable<SolicitudMuestra> {
    return this.http.post<SolicitudMuestra>(`${this.apiUrl}/solicitudMuestras`, solicitud);
  }

}
