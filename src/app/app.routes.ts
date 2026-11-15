import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadChildren: () => import('./public.routes').then((m) => m.PUBLIC_ROUTES)
    },
    {
        path:'private',
        loadChildren: () => import('./private.routes').then((m) => m.PRIVATE_ROUTES)
    },
    {
        path:'**',
        redirectTo:''
    }
];
