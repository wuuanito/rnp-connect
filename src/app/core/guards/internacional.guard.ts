import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
export const internacionalGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const role = authService.getRoleFromToken();
  if (role === 'informatico' || role === 'internacional ') {
    return true;
  } else {
    snackBar.open('No tienes permisos para acceder a esta página', 'Cerrar', {
      duration: 2000,
    });
    router.navigate(['/layout/inicio']);
    return false;
  }

};
