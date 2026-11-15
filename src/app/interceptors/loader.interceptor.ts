import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);
  const auth = inject(AuthService);
  const router = inject(Router);

  const mostrarError = (mensaje: string): void => {
    Swal.fire({ icon: 'error', title: 'Error', text: mensaje });
  };

  loader.mostrar();

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Mensaje que manda la API: { message, data: null }
      const mensajeApi: string | undefined = error.error?.message;
      const esLogin = req.url.endsWith('/login');

      if (error.status === 0) {
        mostrarError('No se pudo conectar con el servidor.');
      } else if (error.status === 401 && !esLogin) {
        // Token vencido o inválido: se cierra la sesión y se vuelve al login
        auth.logout();
        mostrarError('Su sesión ha expirado.');
        router.navigate(['/login'], { replaceUrl: true });
      } else {
        mostrarError(mensajeApi ?? 'Ocurrió un error inesperado.');
      }

      return throwError(() => error);
    }),
    // Corre al terminar (bien o mal): baja el contador del loader
    finalize(() => loader.ocultar()),
  );
};
