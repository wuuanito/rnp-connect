import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  socket: any;

  constructor() {
    this.socket = io('http://192.168.11.19:4000');
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: unknown) => {
        subscriber.next(data);
      });
    });
  }
}
