import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';



interface TimeRecord {
  id: number;
  providerId: number;
  hours: number;
  description: string;
  date: Date;
  isHidden: boolean;
}

interface Provider {
  id: number;
  name: string;
  totalHours: number;
  activeHours: number;
  records: TimeRecord[];
}

interface TimeRecordRequest {
  providerId: number;
  hours: number;
  description: string;
  date: Date;
  isHidden: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BolsaHorasService {
  private apiUrl  = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Provider Operations
  getProviders(): Observable<Provider[]> {
    return this.http.get<any[]>(`${this.apiUrl}/providers`).pipe(
      map(providers => providers.map(provider => ({
        ...provider,
        totalHours: this.calculateTotalHours(provider.records),
        activeHours: this.calculateActiveHours(provider.records)
      }))),
      catchError(this.handleError)
    );
  }

  getProvider(id: number): Observable<Provider> {
    return this.http.get<any>(`${this.apiUrl}/providers/${id}`).pipe(
      map(provider => ({
        ...provider,
        totalHours: this.calculateTotalHours(provider.records),
        activeHours: this.calculateActiveHours(provider.records)
      })),
      catchError(this.handleError)
    );
  }

  addProvider(provider: { name: string }): Observable<Provider> {
    return this.http.post<Provider>(`${this.apiUrl}/providers`, provider).pipe(
      map(provider => ({
        ...provider,
        totalHours: 0,
        activeHours: 0,
        records: []
      })),
      catchError(this.handleError)
    );
  }

  updateProvider(id: number, provider: { name: string }): Observable<Provider> {
    return this.http.put<Provider>(`${this.apiUrl}/providers/${id}`, provider).pipe(
      catchError(this.handleError)
    );
  }

  // Time Record Operations
  addTimeRecord(record: TimeRecordRequest): Observable<TimeRecord> {
    return this.http.post<TimeRecord>(`${this.apiUrl}/records`, record).pipe(
      catchError(this.handleError)
    );
  }

  getTimeRecords(providerId: number): Observable<TimeRecord[]> {
    return this.http.get<TimeRecord[]>(`${this.apiUrl}/records`, {
      params: { providerId: providerId.toString() }
    }).pipe(
      catchError(this.handleError)
    );
  }

  hideTimeRecord(recordId: number): Observable<TimeRecord> {
    return this.http.patch<TimeRecord>(`${this.apiUrl}/records/${recordId}/hide`, {}).pipe(
      catchError(this.handleError)
    );
  }

  unhideTimeRecord(recordId: number): Observable<TimeRecord> {
    return this.http.patch<TimeRecord>(`${this.apiUrl}/records/${recordId}/unhide`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Reports
  getTimeReport(startDate: Date, endDate: Date, providerId?: number): Observable<any> {
    let params: any = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };

    if (providerId) {
      params.providerId = providerId.toString();
    }

    return this.http.get(`${this.apiUrl}/reports/time`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getProviderSummary(providerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/provider-summary/${providerId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Helper methods
  private calculateTotalHours(records: TimeRecord[]): number {
    return records.reduce((total, record) => total + record.hours, 0);
  }

  private calculateActiveHours(records: TimeRecord[]): number {
    return records
      .filter(record => !record.isHidden)
      .reduce((total, record) => total + record.hours, 0);
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
