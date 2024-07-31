import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Servicio para subir archivos con el id de la solicitud de muestra
  uploadFile(file: File, idSolicitudMuestra: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('solicitudId', idSolicitudMuestra.toString());
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getFiles(idSolicitudMuestra: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/files/${idSolicitudMuestra}`);
  }

  downloadFile(fileId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${fileId}`, { responseType: 'blob' });
  }
}
