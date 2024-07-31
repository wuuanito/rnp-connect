import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';  // Asegúrate de que esta línea esté presente
import { PersonalService } from '../../../core/services/personal.service';
import { Personal } from '../../../core/interfaces/personal';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-solicitud-personal',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './solicitud-personal.component.html',
  styleUrl: './solicitud-personal.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SolicitudPersonalComponent implements OnInit {
  @ViewChild('solicitudForm') solicitudForm!: NgForm;

  solicitud: Personal = {
    nombreSolicitante: '',
    numeroCandidatos: 0,
    tipoContrato: '',
    departamento: '',
    puesto: '',
    fechaInicio: '',
    experiencia: '',
    justificacion: '',
    notas: '',
    estado: 'Pendiente'
  };

  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(private personalService: PersonalService) { }

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  onSubmit(): void {
    this.personalService.createSolicitud(this.solicitud).subscribe(
      (response: Personal) => {
        console.log('Solicitud creada con éxito', response);
        this.mensajeExito = '¡Solicitud enviada con éxito! Recargando página...';
        setTimeout(() => {
          this.resetForm();
        }, 3000); // Espera 3 segundos antes de resetear
      },
      (error) => {
        console.error('Error al crear la solicitud', error);
        this.mensajeError = 'Ocurrió un error al enviar la solicitud. Inténtalo de nuevo más tarde.';
      }
    );
  }

  resetForm(): void {
    if (this.solicitudForm) {
      this.solicitudForm.resetForm();
    }
    this.solicitud = {
      nombreSolicitante: '',
      numeroCandidatos: 0,
      tipoContrato: '',
      departamento: '',
      puesto: '',
      fechaInicio: '',
      experiencia: '',
      justificacion: '',
      notas: '',
      estado: 'Pendiente'
    };
    this.mensajeExito = '';
    this.mensajeError = '';
  }
}
