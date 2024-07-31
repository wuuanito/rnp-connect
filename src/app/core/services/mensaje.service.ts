import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mensaje } from '../interfaces/SolicitudMuestra';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMensajes(idSolicitudMuestra: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.apiUrl}/mensajes/${idSolicitudMuestra}`);
  }

  createMensaje(mensaje: Mensaje): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.apiUrl}/mensajes`, mensaje);
  }
}

