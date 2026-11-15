import { Routes } from '@angular/router';
import { noUserGuard } from './guards/no-user.guard';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/public/layout/layout').then((m) => m.Layout),
    canActivate: [noUserGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/public/views/login/login').then((m) => m.Login),
        title: 'Iniciar sesión',
      },
      {
        path: 'register',
        loadComponent: () => import('./components/public/views/register/register').then((m) => m.Register),
        title: 'Registrarse',
      },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ],
  },
];