import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environments';
import { AuthService } from '../services/auth.service';

// Agrega a cada petición a la API los headers que necesita: token de sesión y tipo de contenido
export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo las peticiones a nuestra API; no se manda el token a otros dominios
  if (!req.url.startsWith(environment.baseUrl)) {
    return next(req);
  }

  const token = inject(AuthService).getToken();
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // En subida de archivos (FormData) el navegador pone solo el Content-Type con su boundary
  if (!(req.body instanceof FormData) && !req.headers.has('Content-Type')) {
    headers['Content-Type'] = 'application/json; charset=utf-8';
  }

  return next(req.clone({ setHeaders: headers }));
};
