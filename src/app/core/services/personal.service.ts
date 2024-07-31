import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Personal } from '../interfaces/personal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getSolicitudes(): Observable<Personal[]> {
    return this.http.get<Personal[]>(`${this.apiUrl}/personal`);
  }

  getSolicitudById(id: number): Observable<Personal> {
    return this.http.get<Personal>(`${this.apiUrl}/personal/${id}`);
  }

  createSolicitud(solicitud: Personal): Observable<Personal> {
    return this.http.post<Personal>(`${this.apiUrl}/personal`, solicitud);
  }

  updateSolicitud(id: number, solicitud: Personal): Observable<Personal> {
    return this.http.put<Personal>(`${this.apiUrl}/personal/${id}`, solicitud);
  }

  deleteSolicitud(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/personal/${id}`);
  }
}
