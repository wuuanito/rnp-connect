import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';





@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.token) {
          this.authService.saveToken(response.token);
          this.router.navigate(['/layout/inicio']);  // Redirige a una página protegida
        }
      },
      error: (error) => {
        console.error('Error de autenticación', error);
        // Maneja los errores de autenticación, muestra un mensaje al usuario, etc.
      }
    });
  }


}
