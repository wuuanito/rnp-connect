import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitudMuestra } from '../interfaces/SolicitudMuestra';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http'; // Añadir esta línea

@Injectable({
  providedIn: 'root'
})
export class MuestrasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getSolicitudes(): Observable<SolicitudMuestra[]> {
    return this.http.get<SolicitudMuestra[]>(`${this.apiUrl}/solicitudMuestrasOT`);
  }
  getSolicitudesSoloLab(): Observable<SolicitudMuestra[]> {
    return this.http.get<SolicitudMuestra[]>(`${this.apiUrl}/solicitudMuestrasSoloLab`);
  }
  getSolicitudesLab(): Observable<SolicitudMuestra[]> {
    return this.http.get<SolicitudMuestra[]>(`${this.apiUrl}/solicitudMuestras`);
  }
  createSolicitud(solicitud: Omit<SolicitudMuestra, 'idSolicitudMuestra'>): Observable<SolicitudMuestra> {
    return this.http.post<SolicitudMuestra>(`${this.apiUrl}/solicitudMuestras`, solicitud);
  }
  createSolicitudLabAlm(solicitud: Omit<SolicitudMuestra, 'idSolicitudMuestra'>): Observable<SolicitudMuestra> {
    return this.http.post<SolicitudMuestra>(`${this.apiUrl}/solicitudMuestrasLabAlm`, solicitud);
  }


  getSolicitudExpediciones(): Observable<SolicitudMuestra[]> {
    return this.http.get<SolicitudMuestra[]>(`${this.apiUrl}/solicitudMuestras/expediciones`);
  }

  getSolicitudLab(): Observable<SolicitudMuestra[]> {
    return this.http.get<SolicitudMuestra[]>(`${this.apiUrl}/solicitudMuestras/laboratorio`);
  }

  createMuestrasNecesidadAlmacen(data: { idSolicitudMuestra: number, necesidad: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/muestrasNecesidadAlmacen`, data);
  }

  getNecesidadAlmacen(idSolicitudMuestra: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/muestrasNecesidadAlmacen/${idSolicitudMuestra}`);
  }

  getSolicitudAlm(): Observable<SolicitudMuestra[]> {
    return this.http.get<SolicitudMuestra[]>(`${this.apiUrl}/solicitudMuestras/almacen`);
  }

  updateSolicitudAlmacen(idSolicitudMuestra: number, datosActualizados: Partial<SolicitudMuestra>): Observable<SolicitudMuestra> {
    return this.http.put<SolicitudMuestra>(`${this.apiUrl}/solicitudMuestras/${idSolicitudMuestra}`, datosActualizados);
  }

  devolcerSolicitudLab(idSolicitudMuestra: number): Observable<SolicitudMuestra> {
    return this.http.put<SolicitudMuestra>(`${this.apiUrl}/solicitudMuestras/devolver/${idSolicitudMuestra}`, {});
  }

  enviarSolicitudExpediciones(idSolicitudMuestra: number): Observable<SolicitudMuestra> {
    return this.http.put<SolicitudMuestra>(`${this.apiUrl}/solicitudMuestras/enviarExpediciones/${idSolicitudMuestra}`, {});
  }
  devolveraPm(idSolicitudMuestra: number): Observable<SolicitudMuestra> {
    return this.http.put<SolicitudMuestra>(`${this.apiUrl}/solicitudMuestras/devolverpm/${idSolicitudMuestra}`, {});
  }


  finalizarSolcitud(idSolicitudMuestra: number): Observable<SolicitudMuestra> {
    return this.http.put<SolicitudMuestra>(`${this.apiUrl}/solicitudMuestras/finalizar/${idSolicitudMuestra}`, {});
  }
  generarInformeLaboratorio(fechaDesde: string, fechaHasta: string): Observable<any> {
    const params = new HttpParams()
        .set('fechaDesde', fechaDesde)
        .set('fechaHasta', fechaHasta);

    return this.http.get<any>(`${this.apiUrl}/solicitudMuestras/informe`, { params });
}
}
