// event.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Solicitud } from '../interfaces/solicitud.mode';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private nuevaSolicitudSubject = new Subject<Solicitud>();

  nuevaSolicitud$ = this.nuevaSolicitudSubject.asObservable();

  emitNuevaSolicitud(solicitud: Solicitud) {
    this.nuevaSolicitudSubject.next(solicitud);
  }
}
