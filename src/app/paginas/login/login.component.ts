import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../core/services/notification.service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  {
  email: string = '';
  password: string = '';
  loading: boolean = false; // Nueva variable para controlar el estado de carga
  message: string = ''; // Mensaje de estado
  constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService
  ) { }

  onSubmit(): void {
    this.loading = true; // Mostrar mensaje de carga
    this.message = 'Iniciando sesión...'; // Mensaje de carga

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.token) {
          this.authService.saveToken(response.token);
          this.message = 'Inicio correcto'; // Mensaje de éxito
          setTimeout(() => {
            this.router.navigate(['/layout/inicio']); // Redirige a una página protegida
          }, 1000); // Espera 1 segundo antes de redirigir para mostrar el mensaje
        }
      },
      error: (error) => {
        this.loading = false;
        this.message = 'Error de autenticación o contraseña incorrecta'; // Mensaje de error
        this.notificationService.showError(this.message);
      }
    });
  }
}
