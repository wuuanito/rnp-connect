import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';





@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  constructor(private router: Router) { }

  onSubmit() {
    // Aquí implementarías la lógica de inicio de sesión
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Remember Me:', this.rememberMe);
    // Por ejemplo, llamar a un servicio de autenticación corporativo
  //redirigir a la página de inicio
  this.router.navigateByUrl('layout/inicio');

  }
}
