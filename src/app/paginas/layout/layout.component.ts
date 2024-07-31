import { Component, OnInit } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  constructor(private router: Router,private authService: AuthService) { }
  email: string | null = null;


ngOnInit(): void {
  this.email = this.authService.getEmailFromToken();

}

logout() {
  localStorage.removeItem('token');
  // Redirige a la página de inicio de sesión
  this.router.navigate(['/login']);
}
testTokenDecoding() {
  const email = this.authService.getEmailFromToken();
  const role = this.authService.getRoleFromToken();
  const name = this.authService.getNameFromToken();

  console.log('Email from token:', email);
  console.log('Role from token:', role);
  console.log('Name from token:', name);

  if (email && role) {
    console.log('Token decodificado exitosamente');
  } else {
    console.log('No se pudo decodificar el token o falta información');
  }
}
}
