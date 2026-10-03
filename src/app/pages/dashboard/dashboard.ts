import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Caso } from '../../services/caso';

@Component({
  imports: [RouterLink],
  selector: 'app-dashboard',
  styleUrl: 'dashboard.css',
  templateUrl: 'dashboard.html',
})
export class Dashboard implements OnInit {

  private readonly router = inject(Router);
  private readonly casoService = inject(Caso);

  casos = signal<any[]>([]);

  totalCasos = signal(0);
  casosActivos = signal(0);
  casosSeguimiento = signal(0);
  casosCerrados = signal(0);

  usuarioActual = '';
  rolActual = '';

  mensajeError = '';

  ngOnInit() {

    const username =
      localStorage.getItem('username') || '';

    this.usuarioActual =
      this.obtenerNombreMostrar(username);

    this.rolActual =
      localStorage.getItem('role') || '';

    this.obtenerResumen();
  }

  obtenerNombreMostrar(username: string): string {

    const nombresUsuarios: Record<string, string> = {

      'N00404657': 'Iván Asencio',

      'N00455009': 'Eder Guerrero',

      'N00032972': 'José Ruiz',

      'N00400282': 'Nelver Vigo',

      '11111111': 'Admin Admin'

    };

    return nombresUsuarios[username] || username || 'Usuario';
  }

  obtenerResumen() {

    this.mensajeError = '';

    this.casoService.obtenerCasos().subscribe({

      next: (respuesta) => {

        console.log(
          'Casos obtenidos para Dashboard:',
          respuesta
        );

        this.casos.set(respuesta);

        this.totalCasos.set(
          respuesta.length
        );

        this.casosActivos.set(
          respuesta.filter((caso) =>
            this.normalizar(caso.estado) === 'activo'
          ).length
        );

        this.casosSeguimiento.set(
          respuesta.filter((caso) =>
            this.normalizar(caso.estado) === 'en seguimiento'
          ).length
        );

        this.casosCerrados.set(
          respuesta.filter((caso) =>
            this.normalizar(caso.estado) === 'cerrado'
          ).length
        );
      },

      error: (error) => {

        console.error(
          'Error al obtener casos para Dashboard:',
          error
        );

        this.mensajeError =
          'No se pudo cargar el resumen de casos.';
      }

    });
  }

  normalizar(valor: any): string {

    return String(valor ?? '')
      .trim()
      .toLowerCase();
  }

  obtenerCasosRecientes(): any[] {

    return [...this.casos()]
      .sort((a, b) => {

        const fechaA =
          new Date(a.fechaRegistro).getTime();

        const fechaB =
          new Date(b.fechaRegistro).getTime();

        return fechaB - fechaA;
      })
      .slice(0, 3);
  }

  cerrarSesion() {

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }
}
