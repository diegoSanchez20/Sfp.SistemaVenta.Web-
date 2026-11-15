import { Routes } from '@angular/router';
// import { hasUserGuard } from './guards/has-user.guard';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/private/layout/layout').then((m) => m.Layout),
    // canActivate: [hasUserGuard],
    children: [
      {
        path: 'client',
        loadComponent: () => import('./components/private/views/client/client').then((m) => m.Client),
        title: 'Clientes',
      },
      {
        path: 'person',
        loadComponent: () => import('./components/private/views/person/person').then((m) => m.Person),
        title: 'Personas',
      },
      { path: '', pathMatch: 'full', redirectTo: 'client' },
    ],
  },
];