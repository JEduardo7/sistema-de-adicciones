import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Caso } from '../../services/caso';

@Component({
  selector: 'app-reportes',
  imports: [],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {

  private readonly casoService = inject(Caso);
  private readonly router = inject(Router);

  casos = signal<any[]>([]);

  totalCasos = signal(0);
  casosActivos = signal(0);
  casosSeguimiento = signal(0);
  casosCerrados = signal(0);

  riesgoBajo = signal(0);
  riesgoMedio = signal(0);
  riesgoAlto = signal(0);

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

    this.obtenerReporte();
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

  obtenerNombreProfesional(codigo: string): string {

    const profesionales: Record<string, string> = {

      'N00404657': 'Iván Asencio',

      'N00455009': 'Eder Guerrero',

      'N00032972': 'José Ruiz',

      'N00400282': 'Nelver Vigo'

    };

    return profesionales[codigo] || codigo || 'Sin asignar';
  }

  esAdministrador(): boolean {

    return this.rolActual === 'ADMINISTRADOR';

  }

  obtenerReporte() {

    this.mensajeError = '';

    this.casoService.obtenerCasos().subscribe({

      next: (respuesta) => {

        console.log(
          'Casos obtenidos para Reportes:',
          respuesta
        );

        this.casos.set(respuesta);

        this.calcularIndicadores(respuesta);

      },

      error: (error) => {

        console.error(
          'Error al obtener casos para Reportes:',
          error
        );

        this.mensajeError =
          'No se pudieron cargar los datos del reporte.';

      }

    });

  }

  calcularIndicadores(casos: any[]) {

    this.totalCasos.set(casos.length);

    this.casosActivos.set(
      casos.filter(
        caso =>
          this.normalizar(caso.estado) === 'activo'
      ).length
    );

    this.casosSeguimiento.set(
      casos.filter(
        caso =>
          this.normalizar(caso.estado) === 'en seguimiento'
      ).length
    );

    this.casosCerrados.set(
      casos.filter(
        caso =>
          this.normalizar(caso.estado) === 'cerrado'
      ).length
    );

    this.riesgoBajo.set(
      casos.filter(
        caso =>
          this.normalizar(caso.nivelRiesgo) === 'bajo'
      ).length
    );

    this.riesgoMedio.set(
      casos.filter(
        caso =>
          this.normalizar(caso.nivelRiesgo) === 'medio'
      ).length
    );

    this.riesgoAlto.set(
      casos.filter(
        caso =>
          this.normalizar(caso.nivelRiesgo) === 'alto'
      ).length
    );

  }

  normalizar(valor: any): string {

    return String(valor ?? '')
      .trim()
      .toLowerCase();

  }

  volverDashboard() {

    this.router.navigate(['/dashboard']);

  }

  volverCasos() {

    this.router.navigate(['/casos']);

  }

  cerrarSesion() {

    localStorage.removeItem('token');

    localStorage.removeItem('username');

    localStorage.removeItem('role');

    this.router.navigate(['/login']);

  }

}
