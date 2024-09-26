import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-event-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
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
        <mat-form-field>
          <input matInput type="date" placeholder="Fecha de inicio" formControlName="start" required>
        </mat-form-field>
        <mat-form-field>
          <mat-select placeholder="Tipo de Visita" formControlName="visitType" (selectionChange)="onVisitTypeChange($event.value)">
            <mat-option *ngFor="let type of visitTypes" [value]="type.value">{{ type.label }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Sala" formControlName="sala">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Responsable" formControlName="responsable">
        </mat-form-field>
        <!-- Participantes -->
        <mat-form-field>
          <input matInput placeholder="Agregar Participante" [formControl]="participantControl" [matAutocomplete]="auto">
          <mat-autocomplete #auto="matAutocomplete">
            <mat-option *ngFor="let contact of filteredContacts$ | async" [value]="contact">
              {{ contact }}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        <div formArrayName="participants">
          <div *ngFor="let participant of participants.controls; let i = index" [formGroupName]="i" class="participant-container">
            <mat-form-field>
              <input matInput formControlName="email" [value]="participant.get('email')?.value" readonly>
            </mat-form-field>
            <button mat-button color="warn" (click)="removeParticipant(i)">Eliminar</button>
          </div>
        </div>
        <button mat-button color="accent" (click)="addParticipant()">Añadir Participante</button>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-button color="primary" (click)="onSave()" [disabled]="!eventForm.valid">Enviar</button>
    </mat-dialog-actions>
  `,

  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .participant-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    mat-form-field {
      width: 100%;
    }
    mat-autocomplete {
      max-height: 200px;
    }
  `]
})
export class AddEventDialogComponent {
  eventForm: FormGroup;
  participantControl = new FormControl();
  contactList: string[] = [
    // Lista de contactos
'admin.produccion@naturepharma.es','administracion@naturepharma.es','agalvan@naturepharma.es','ainhoa.project@naturepharma.es','allende.project@naturepharma.es','amartinez.project@naturepharma.es','andres.project@naturepharma.es','asianmarket@naturepharma.es','aux.laboratorio@naturepharma.es','back.office@naturepharma.es','calidad@naturepharma.es','compras@naturepharma.es','coordinadorsupervisores@naturepharma.es','cosmetica@naturepharma.es','cristina.project@naturepharma.es','cvs@naturepharma.es','desarrollos@naturepharma.es','direccioncompras@naturepharma.es','direccioninstalaciones@naturepharma.es','direccionlogistica@naturepharma.es','direcciontecnica@naturepharma.es','expediciones@naturepharma.es','export@naturepharma.es','facturas@naturepharma.es','financiero@naturepharma.es','formaciones@naturepharma.es','gestorcompras@naturepharma.es','gestorpedidos@naturepharma.es','gestorproduccion@naturepharma.es','info@naturepharma.es','infoadministracion@naturepharma.es','infoalmacen@naturepharma.es','infocompras@naturepharma.es','infologistica@naturepharma.es','informaciontecnica@naturepharma.es','informatico@naturepharma.es','isabel.softgel@naturepharma.es','laboratorio@naturepharma.es','leyre.project@naturepharma.es','logistica@naturepharma.es','logistica2@naturepharma.es','logistica3@naturepharma.es','logistica4@naturepharma.es','logistica9@naturepharma.es','mantenimiento@naturepharma.es','mario.project@naturepharma.es','martin@naturepharma.es','marta.project@naturepharma.es','mezclas@naturepharma.es','monica.softgel@naturepharma.es','nachoverdu@naturepharma.es','naturepharma@naturepharma.es','news@naturepharma.es','no-reply@naturepharma.es','oficinaetica@naturepharma.es','oficinaeticanaturepharma@naturepharma.es','operaciones@naturepharma.es','packing@naturepharma.es','paula.project@naturepharma.es','pedro.project@naturepharma.es','planif.produccion@naturepharma.es','practicas@naturepharma.es','prevencion@naturepharma.es','produccion@naturepharma.es','produccion2@naturepharma.es','produccion3@naturepharma.es','rebeca.project@naturepharma.es','rps@naturepharma.es','rrhh@naturepharma.es','sara.softgel@naturepharma.es','secundario@naturepharma.es','supervisorproduccion@naturepharma.es','tecnico@naturepharma.es','tecnicocalidad@naturepharma.es','tecnicocosmetica@naturepharma.es','tecnicologistica@naturepharma.es','tecnicoplanta@naturepharma.es','tecnicoplanta2@naturepharma.es','tecnicoplanta3@naturepharma.es','tecnicoqc@naturepharma.es','tecnicoqc2@naturepharma.es','tecnicoqc3@naturepharma.es','tecnicoqc4@naturepharma.es','tecnicorrhh@naturepharma.es','tecnicosoftgel@naturepharma.es','tecnicosoftgel2@naturepharma.es','tecnicosoftgel3@naturepharma.es','victoria.project@naturepharma.es','virginia.softgel@naturepharma.es'

  ];
  filteredContacts$: Observable<string[]>;

  visitTypes = [
    { value: 'visitas', label: 'Visitas', color: '#1565c0' },
    { value: 'clientes', label: 'Visitas Clientes', color: '#cc14cc' },
    { value: 'proveedores', label: 'Proveedores', color: '#ef6c00' },
    { value: 'auditorias', label: 'Auditorias y Certificaciones', color: '#14cccc' },
    { value: 'otros', label: 'Otros', color: '#66bb6a' }
  ];

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
      allDay: [data.allDay],
      color: ['#2e7d32'],
      visitType: ['', Validators.required],
      sala: [''],
      responsable: [''],
      participants: this.fb.array([])
    });

    if (data) {
      this.eventForm.patchValue(data);
    }

    this.filteredContacts$ = this.participantControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  // Getter para facilitar el acceso al FormArray de participantes
  get participants(): FormArray {
    return this.eventForm.get('participants') as FormArray;
  }

  // Filtrar contactos para el autocompletado
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.contactList.filter(contact => contact.toLowerCase().includes(filterValue));
  }

  // Añadir un nuevo participante
  addParticipant(): void {
    if (this.participantControl.value && !this.participants.controls.some(p => p.get('email')?.value === this.participantControl.value)) {
      const participantGroup = this.fb.group({
        email: [this.participantControl.value, [Validators.required, Validators.email]]  // Validamos que sea un correo válido
      });
      this.participants.push(participantGroup);
      this.participantControl.setValue('');  // Limpiar el campo después de añadir
    }
  }

  // Eliminar un participante
  removeParticipant(index: number): void {
    this.participants.removeAt(index);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.eventForm.valid) {
        console.log('Datos del evento a guardar:', this.eventForm.value); // Verifica aquí
        this.dialogRef.close(this.eventForm.value); // Esto ya incluye sala
    }
}

  // Actualizar el color del evento basado en el tipo de visita seleccionado
  onVisitTypeChange(visitType: string): void {
    const selectedType = this.visitTypes.find(type => type.value === visitType);
    if (selectedType) {
      this.eventForm.patchValue({ color: selectedType.color });
    }
  }
}
