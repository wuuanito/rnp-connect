import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-solicitud-detalles',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Detalles de la Solicitud</h2>
    <mat-dialog-content>
      <p><strong>Persona que Solicita:</strong> {{ data.personaSolicita }}</p>
      <p><strong>Nombre Materia:</strong> {{ data.nombreMateria }}</p>
      <p><strong>Código:</strong> {{ data.codigo }}</p>
      <p><strong>Lote:</strong> {{ data.lote }}</p>
      <p><strong>Proveedor:</strong> {{ data.proveedor }}</p>
      <p><strong>Ubicación:</strong> {{ data.ubicacion }}</p>
      <p><strong>Urgencia:</strong> {{ data.urgencia }}</p>
      <p><strong>Estado:</strong> {{ data.estado }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cerrar</button>
    </mat-dialog-actions>
  `,
})
export class SolicitudDetallesComponent {
  constructor(
    public dialogRef: MatDialogRef<SolicitudDetallesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
