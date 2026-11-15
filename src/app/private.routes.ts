import { Routes } from '@angular/router';
import { hasUserGuard } from './guards/has-user.guard';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/private/layout/layout').then((m) => m.Layout),
    canActivate: [hasUserGuard],
    canActivateChild: [hasUserGuard],
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
      {
        path: 'menu',
        loadComponent: () => import('./components/private/views/menu/menu').then((m) => m.Menu),
        title: 'Menú',
      },
      {
        path: 'role',
        loadComponent: () => import('./components/private/views/role/role').then((m) => m.Role),
        title: 'Roles',
      },
      {
        path: 'permission',
        loadComponent: () => import('./components/private/views/permission/permission').then((m) => m.Permission),
        title: 'Permisos',
      },
      { path: '', pathMatch: 'full', redirectTo: 'client' },
    ],
  },
];