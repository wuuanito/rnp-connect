import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, idSolicitudMuestra: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('idSolicitudMuestra', idSolicitudMuestra);

    return this.http.post<any>(`${this.apiUrl}/upload`, formData, {
      headers: new HttpHeaders({
        // Headers adicionales si es necesario
      })
    });
  }

  getFiles(idSolicitudMuestra: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/files/${idSolicitudMuestra}`);
  }

  //Eliminar archivo segun el id
// file-upload.service.ts
// file-upload.service.ts
deleteFile(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/files/${id}`);
}


}
