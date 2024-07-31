import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private apiUrl = environment.apiUrl;

  socket: any;

  constructor() {
    this.socket = io(`${this.apiUrl}`);
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: unknown) => {
        subscriber.next(data);
      });
    });
  }
}
