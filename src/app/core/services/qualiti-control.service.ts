import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {QualityControl, QualityControlUpdate} from '../interfaces/QualityControl';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class QualitiControlService {

  private apiUrl = '/api/quality-controls';
  private qualityControlsSubject = new BehaviorSubject<QualityControl[]>([]);
  qualityControls$ = this.qualityControlsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getQualityControls(startDate?: Date, endDate?: Date): Observable<QualityControl[]> {
    let url = this.apiUrl;
    if (startDate && endDate) {
      url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    }

    return this.http.get<QualityControl[]>(url).pipe(
      tap(controls => this.qualityControlsSubject.next(controls))
    );
  }

  updateQualityControl(id: number, update: Partial<QualityControl>): Observable<QualityControl> {
    return this.http.put<QualityControl>(`${this.apiUrl}/${id}`, update).pipe(
      tap(updatedControl => {
        const currentControls = this.qualityControlsSubject.value;
        const updatedControls = currentControls.map(control =>
          control.id === id ? updatedControl : control
        );
        this.qualityControlsSubject.next(updatedControls);
      })
    );
  }

  createQualityControl(control: Omit<QualityControl, 'id'>): Observable<QualityControl> {
    return this.http.post<QualityControl>(this.apiUrl, control).pipe(
      tap(newControl => {
        const currentControls = this.qualityControlsSubject.value;
        this.qualityControlsSubject.next([...currentControls, newControl]);
      })
    );
  }
}
