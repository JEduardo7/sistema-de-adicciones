import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Casos } from './pages/casos/casos';
import { FichaCaso } from './pages/ficha-caso/ficha-caso';
import { NuevoSeguimiento } from './pages/nuevo-seguimiento/nuevo-seguimiento';
import { NuevoCaso } from './pages/nuevo-caso/nuevo-caso';
import { Reportes } from './pages/reportes/reportes';
import { Usuarios } from './pages/usuarios/usuarios';
import { Seguimientos } from './pages/seguimientos/seguimientos';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'casos',
    component: Casos,
    canActivate: [authGuard]
  },

  {
    path: 'ficha-caso',
    component: FichaCaso,
    canActivate: [authGuard]
  },

  {
    path: 'nuevo-seguimiento',
    component: NuevoSeguimiento,
    canActivate: [authGuard]
  },

  {
    path: 'nuevo-caso',
    component: NuevoCaso,
    canActivate: [authGuard]
  },

  {
    path: 'seguimientos',
    component: Seguimientos,
    canActivate: [authGuard]
  },

  {
    path: 'reportes',
    component: Reportes,
    canActivate: [authGuard]
  },

  {
    path: 'usuarios',
    component: Usuarios,
    canActivate: [authGuard]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];
