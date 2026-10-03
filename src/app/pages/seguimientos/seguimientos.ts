import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Seguimiento } from '../../services/seguimiento';
import { Caso } from '../../services/caso';

@Component({
  selector: 'app-seguimientos',
  imports: [FormsModule, RouterLink],
  templateUrl: './seguimientos.html',
  styleUrl: './seguimientos.css',
})
export class Seguimientos implements OnInit {

  private readonly seguimientoService = inject(Seguimiento);
  private readonly casoService = inject(Caso);
  private readonly router = inject(Router);

  seguimientos = signal<any[]>([]);
  seguimientosFiltrados = signal<any[]>([]);

  casos = signal<any[]>([]);

  profesionalFiltro = '';

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

    this.obtenerCasos();
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

      'N00404657': 'Iván David Asencio Julcamoro',

      'N00455009': 'Eder Guerrero Carranza',

      'N00032972': 'José Eduardo Ruiz Castillo',

      'N00400282': 'Nelver Vigo Cabanillas'

    };

    return profesionales[codigo] || 'No registrado';
  }

  obtenerCasos() {

    this.casoService
      .obtenerCasos()
      .subscribe({

        next: (respuesta) => {

          this.casos.set(respuesta);

          this.obtenerSeguimientos();

        },

        error: (error) => {

          console.error(
            'Error al obtener casos:',
            error
          );

          this.mensajeError =
            'No se pudo cargar la información de los casos.';

          this.casos.set([]);

          this.obtenerSeguimientos();

        }

      });

  }

  obtenerSeguimientos() {

    this.mensajeError = '';

    this.seguimientoService
      .obtenerTodosLosSeguimientos()
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Seguimientos obtenidos:',
            respuesta
          );

          const seguimientosConCaso =
            respuesta.map((seguimiento) => {

              const caso =
                this.casos().find(
                  item =>
                    Number(item.id) ===
                    Number(seguimiento.casoId)
                );

              return {
                ...seguimiento,
                codigoCaso:
                  caso?.codigoCaso || '',
                nombrePaciente:
                  caso
                    ? `${caso.nombres || ''} ${caso.apellidos || ''}`.trim()
                    : ''
              };

            });

          this.seguimientos.set(
            seguimientosConCaso
          );

          this.seguimientosFiltrados.set(
            seguimientosConCaso
          );

        },

        error: (error) => {

          console.error(
            'Error al obtener seguimientos:',
            error
          );

          this.mensajeError =
            'No se pudieron cargar los seguimientos.';

          this.seguimientos.set([]);
          this.seguimientosFiltrados.set([]);

        }

      });

  }

  filtrarSeguimientos() {

    const profesionalSeleccionado =
      this.profesionalFiltro
        .trim()
        .toLowerCase();

    const resultados =
      this.seguimientos().filter(
        (seguimiento) => {

          const profesional =
            String(
              seguimiento.profesional || ''
            )
              .trim()
              .toLowerCase();

          return (
            !profesionalSeleccionado ||
            profesional === profesionalSeleccionado
          );

        }
      );

    this.seguimientosFiltrados.set(
      resultados
    );

  }

  limpiarFiltros() {

    this.profesionalFiltro = '';

    this.seguimientosFiltrados.set(
      this.seguimientos()
    );

  }

  esAdministrador(): boolean {

    return this.rolActual === 'ADMINISTRADOR';

  }

  verFichaCaso(casoId: number) {

    this.router.navigate(
      ['/ficha-caso'],
      {
        queryParams: {
          id: casoId
        }
      }
    );

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
