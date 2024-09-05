import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-event-dialog',
  standalone: true,
  imports:[ MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Añadir Nuevo Evento</h2>
    <mat-dialog-content>
      <form [formGroup]="eventForm">
        <mat-form-field>
          <input matInput placeholder="Título" formControlName="title" required>
        </mat-form-field>
        <mat-form-field>
          <textarea matInput placeholder="Descripción" formControlName="description"></textarea>
        </mat-form-field>
      
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-button color="primary" (click)="onSave()" [disabled]="!eventForm.valid">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `]
})
export class AddEventDialogComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      start: [data.start, Validators.required],
      end: [data.end, Validators.required],
      allDay: [data.allDay]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.eventForm.valid) {
      this.dialogRef.close(this.eventForm.value);
    }
  }
}
