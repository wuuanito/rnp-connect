import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BolsaHorasService } from '../../../../core/services/bolsa-horas.service';
import { ChangeDetectorRef } from '@angular/core';

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
@Component({
  selector: 'app-bolsahoras-informatica',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTabsModule,
    MatDialogModule
  ],  templateUrl: './bolsahoras-informatica.component.html',
  styleUrl: './bolsahoras-informatica.component.css'
})
export class BolsahorasInformaticaComponent implements OnInit {
  providers: Provider[] = [];
  timeRecordForm: FormGroup;
  providerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private timeService: BolsaHorasService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef // Inyectar ChangeDetectorRef

  ) {
    this.timeRecordForm = this.fb.group({
      providerId: ['', Validators.required],
      date: [new Date(), Validators.required],
      hours: ['', [Validators.required, Validators.min(0.5)]],
      description: ['', Validators.required]
    });

    this.providerForm = this.fb.group({
      name: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.loadProviders();
  }

  getTotalHours(provider: Provider): string {
    const total = provider.records.reduce((sum, record) => {
      const hours = typeof record.hours === 'string' ? parseFloat(record.hours) : record.hours;
      return sum + (isNaN(hours) ? 0 : hours);
    }, 0);
    return total.toFixed(2);
  }

  // Método mejorado para formatear y calcular horas activas
  getActiveHours(provider: Provider): string {
    const active = provider.records
      .filter(record => !record.isHidden)
      .reduce((sum, record) => {
        const hours = typeof record.hours === 'string' ? parseFloat(record.hours) : record.hours;
        return sum + (isNaN(hours) ? 0 : hours);
      }, 0);
    return active.toFixed(2);
  }
  loadProviders(): void {
    this.timeService.getProviders().subscribe({
      next: (data) => {
        this.providers = data.map(provider => ({
          ...provider,
          totalHours: this.parseNumber(this.getTotalHours(provider)),
          activeHours: this.parseNumber(this.getActiveHours(provider)),
          records: provider.records.map(record => ({
            ...record,
            hours: this.parseNumber(record.hours)
          }))
        }));
        this.cdr.detectChanges(); // Forzar la detección de cambios
      },
      error: (error) => {
        this.showError('Error al cargar proveedores');
      }
    });
  }
  formatHours(hours: any): string {
    const numericHours = this.parseNumber(hours);
    return numericHours.toFixed(2);
  }

  private parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  submitTimeRecord(): void {
    if (this.timeRecordForm.valid) {
      const formValue = this.timeRecordForm.value;
      const hours = this.parseNumber(formValue.hours);

      this.timeService.addTimeRecord({
        ...formValue,
        hours,
        isHidden: false
      }).subscribe({
        next: (response) => {
          const provider = this.providers.find(p => p.id === formValue.providerId);
          this.loadProviders(); // Asegúrate de que esto obtenga los datos actualizados

          if (provider) {
            provider.totalHours = this.parseNumber(provider.totalHours) + hours;
            provider.activeHours = this.parseNumber(provider.activeHours) + hours;
            provider.records.push({
              ...response,
              hours: this.parseNumber(response.hours)
            });
          }
          this.timeRecordForm.reset({date: new Date()});
          this.showSuccess('Horas registradas correctamente');
        },
        error: (error) => {
          this.showError('Error al registrar las horas');
        }
      });
    }
  }

  addProvider(): void {
    if (this.providerForm.valid) {
      this.timeService.addProvider(this.providerForm.value).subscribe({
        next: (provider) => {
          this.providers.push({
            ...provider,
            totalHours: 0,
            activeHours: 0,
            records: []
          });
          this.providerForm.reset();
          this.showSuccess('Proveedor agregado correctamente');
        },
        error: (error) => {
          this.showError('Error al agregar el proveedor');
        }
      });
    }
  }


  hideHours(providerId: number, recordId: number): void {
    this.timeService.hideTimeRecord(recordId).subscribe({
      next: () => {
        const provider = this.providers.find(p => p.id === providerId);
        if (provider) {
          const record = provider.records.find(r => r.id === recordId);
          if (record) {
            record.isHidden = true;
            provider.activeHours = this.parseNumber(provider.activeHours) -
                                 this.parseNumber(record.hours);
          }
        }
        this.showSuccess('Registro ocultado correctamente');
      },
      error: (error) => {
        this.showError('Error al ocultar el registro');
      }
    });
  }
  getTotalActiveHours(): number {
    return this.providers.reduce((sum, provider) =>
      sum + this.parseNumber(provider.activeHours), 0);
  }

  getCurrentMonthRecords(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return this.providers.reduce((sum, provider) => {
      return sum + provider.records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === currentMonth &&
               recordDate.getFullYear() === currentYear;
      }).length;
    }, 0);
  }
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  // Métodos de filtrado y ordenamiento
  sortRecordsByDate(records: TimeRecord[]): TimeRecord[] {
    return [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getFilteredRecords(provider: Provider): TimeRecord[] {
    return this.sortRecordsByDate(provider.records);
  }

  // Métodos de exportación
  exportProviderData(providerId: number): void {
    const provider = this.providers.find(p => p.id === providerId);
    if (!provider) return;

    const records = provider.records.map(record => ({
      fecha: new Date(record.date).toLocaleDateString(),
      hora: new Date(record.date).toLocaleTimeString(),
      horas: record.hours,
      descripcion: record.description,
      estado: record.isHidden ? 'Oculto' : 'Activo'
    }));

    // Crear CSV
    const headers = ['Fecha', 'Hora', 'Horas', 'Descripción', 'Estado'];
    const csvContent = [
      headers.join(','),
      ...records.map(record => [
        record.fecha,
        record.hora,
        record.horas,
        `"${record.descripcion}"`,
        record.estado
      ].join(','))
    ].join('\n');

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `registros_${provider.name}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Métodos de estadísticas
  getProviderStats(providerId: number) {
    const provider = this.providers.find(p => p.id === providerId);
    if (!provider) return null;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthRecords = provider.records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth &&
             recordDate.getFullYear() === currentYear;
    });

    return {
      totalHours: provider.totalHours,
      activeHours: provider.activeHours,
      monthlyHours: monthRecords.reduce((sum, record) => sum + record.hours, 0),
      monthlyRecords: monthRecords.length,
      averageHoursPerRecord: provider.records.length ?
        (provider.totalHours / provider.records.length).toFixed(1) : 0
    };
  }

  // Métodos de validación
  validateHours(hours: number): boolean {
    return hours >= 0.5 && hours <= 24;
  }

  validateFutureDate(date: Date): boolean {
    return new Date(date) <= new Date();
  }

  // Método para resetear formularios
  resetForms(): void {
    this.timeRecordForm.reset({
      date: new Date(),
      hours: '',
      description: '',
      providerId: ''
    });
    this.providerForm.reset();
  }

  // Método para manejar cambios en el formulario
  onProviderChange(providerId: number): void {
    const provider = this.providers.find(p => p.id === providerId);
    if (provider) {
      // Actualizar estadísticas o realizar otras acciones necesarias
      const stats = this.getProviderStats(providerId);
      // Aquí podrías emitir un evento o actualizar el UI según necesites
    }
  }

  // Método para validar el formulario completo
  validateTimeRecordForm(): boolean {
    const formValue = this.timeRecordForm.value;
    return this.timeRecordForm.valid &&
           this.validateHours(formValue.hours) &&
           this.validateFutureDate(formValue.date);
  }

  // Método para manejar errores del servidor
  handleServerError(error: any): void {
    console.error('Error en el servidor:', error);
    let errorMessage = 'Ha ocurrido un error en el servidor';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    }

    this.showError(errorMessage);
  }

  // Método para actualizar los datos localmente después de una operación exitosa
  updateLocalData(providerId: number, record: TimeRecord): void {
    const provider = this.providers.find(p => p.id === providerId);
    if (provider) {
      provider.records.push(record);
      provider.totalHours += record.hours;
      provider.activeHours += record.hours;
      // Ordenar registros por fecha
      provider.records = this.sortRecordsByDate(provider.records);

      this.cdr.detectChanges(); // Forzar la detección de cambios
    }
  }
}
