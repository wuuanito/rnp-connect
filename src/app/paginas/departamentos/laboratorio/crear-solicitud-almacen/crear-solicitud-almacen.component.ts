import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';  // <-- Importa FormsModule aquí
import { ReactiveFormsModule } from '@angular/forms';
import {  FormGroup, Validators } from '@angular/forms';
import { SolicitudesMateriaPrimaService } from '../../../../core/services/solicitudes-materia-prima.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-crear-solicitud-almacen',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatFormFieldModule,MatSelectModule,MatInputModule,MatButtonModule],
  templateUrl: './crear-solicitud-almacen.component.html',
  styleUrl: './crear-solicitud-almacen.component.css'
})
export class CrearSolicitudAlmacenComponent implements OnInit {
  materialRequestForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudesMateriaPrimaService
  ) {}

  ngOnInit() {
    this.materialRequestForm = this.fb.group({
      fechaSolicitud: [this.getCurrentDate(), Validators.required], // Habilita el campo para verificar el valor
      personaSolicita: ['', Validators.required],
      nombreMateria: ['', Validators.required],
      codigo: ['', Validators.required],
      lote: ['', Validators.required],
      proveedor: ['', Validators.required],
      ubicacion: ['', Validators.required],
      urgencia: ['', Validators.required],
      materiasEntregadas: [''],
      materiasDevueltas: ['']
    });
  }

  onSubmit() {
    if (this.materialRequestForm.valid) {
      const formData = {
        ...this.materialRequestForm.value,
        fechaSolicitud: this.materialRequestForm.value.fechaSolicitud // Esto debería estar en formato 'YYYY-MM-DD'
      };

      console.log('Datos enviados:', formData); // Verifica el contenido aquí

      this.solicitudService.createSolicitud(formData).subscribe(
        response => {
          console.log('Solicitud creada con éxito:', response);
          this.materialRequestForm.reset();
        },
        error => {
          console.error('Error al crear la solicitud:', error);
        }
      );
    }


  }



  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Asegúrate de que esto sea correcto
  }

  getRowClass(estado: string): string {
    switch (estado) {
      case 'Creado':
        return 'state-created';
      case 'Entregado':
        return 'state-delivered';
      default:
        return ''; // O una clase por defecto si es necesario
    }
  }

}
