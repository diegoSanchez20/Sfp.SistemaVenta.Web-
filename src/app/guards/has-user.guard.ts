import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Deja pasar solo si hay sesión iniciada; si no, manda al login
export const hasUserGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  // Limpia un token vencido o datos viejos antes de volver al login
  auth.logout();

  return router.createUrlTree(['/login']);
};