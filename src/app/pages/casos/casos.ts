import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Caso } from '../../services/caso';

@Component({
  imports: [FormsModule],
  selector: 'app-casos',
  styleUrl: './casos.css',
  templateUrl: './casos.html',
})
export class Casos implements OnInit {

  private readonly casoService = inject(Caso);
  private readonly router = inject(Router);

  casos = signal<any[]>([]);
  casosFiltrados = signal<any[]>([]);

  busqueda = '';
  nivelRiesgo = '';
  estado = '';
  profesionalFiltro = '';

  usuarioActual = '';
  rolActual = '';

  mensajeError = '';
  eliminando = false;

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

      'N00404657': 'Iván Asencio',

      'N00455009': 'Eder Guerrero',

      'N00032972': 'José Ruiz',

      'N00400282': 'Nelver Vigo'

    };

    return profesionales[codigo] || codigo || 'Sin asignar';
  }

  obtenerCasos() {

    this.mensajeError = '';

    this.casoService.obtenerCasos().subscribe({

      next: (respuesta) => {

        console.log(
          'Casos obtenidos:',
          respuesta
        );

        this.casos.set(respuesta);
        this.casosFiltrados.set(respuesta);

      },

      error: (error) => {

        console.error(
          'Error al obtener casos:',
          error
        );

        this.mensajeError =
          'No se pudieron cargar los casos.';

        this.casos.set([]);
        this.casosFiltrados.set([]);

      }

    });

  }

  filtrarCasos() {

    const textoBusqueda =
      this.normalizar(this.busqueda);

    const riesgoSeleccionado =
      this.normalizar(this.nivelRiesgo);

    const estadoSeleccionado =
      this.normalizar(this.estado);

    const profesionalSeleccionado =
      this.normalizar(this.profesionalFiltro);

    const resultados =
      this.casos().filter((caso) => {

        const codigoCaso =
          this.normalizar(caso.codigoCaso);

        const nombres =
          this.normalizar(caso.nombres);

        const apellidos =
          this.normalizar(caso.apellidos);

        const riesgoCaso =
          this.normalizar(caso.nivelRiesgo);

        const estadoCaso =
          this.normalizar(caso.estado);

        const profesionalCaso =
          this.normalizar(caso.profesional);

        const coincideBusqueda =
          !textoBusqueda ||
          codigoCaso.includes(textoBusqueda) ||
          nombres.includes(textoBusqueda) ||
          apellidos.includes(textoBusqueda);

        const coincideRiesgo =
          !riesgoSeleccionado ||
          riesgoCaso === riesgoSeleccionado;

        const coincideEstado =
          !estadoSeleccionado ||
          estadoCaso === estadoSeleccionado;

        const coincideProfesional =
          !profesionalSeleccionado ||
          profesionalCaso === profesionalSeleccionado;

        return (
          coincideBusqueda &&
          coincideRiesgo &&
          coincideEstado &&
          coincideProfesional
        );

      });

    this.casosFiltrados.set(resultados);

  }

  limpiarFiltros() {

    this.busqueda = '';
    this.nivelRiesgo = '';
    this.estado = '';
    this.profesionalFiltro = '';

    this.casosFiltrados.set(
      this.casos()
    );

  }

  normalizar(valor: any): string {

    return String(valor ?? '')
      .trim()
      .toLowerCase();

  }

  esAdministrador(): boolean {

    return this.rolActual === 'ADMINISTRADOR';

  }

  volverDashboard() {

    this.router.navigate(['/dashboard']);

  }

  verFicha(id: number) {

    this.router.navigate(
      ['/ficha-caso'],
      {
        queryParams: {
          id: id
        }
      }
    );

  }

  nuevoCaso() {

    this.router.navigate(['/nuevo-caso']);

  }

  eliminarCaso(id: number) {

    if (!this.esAdministrador() || this.eliminando) {
      return;
    }

    const caso = this.casos().find(
      (item) => item.id === id
    );

    if (!caso) {
      return;
    }

    const confirmado = window.confirm(
      `¿Está seguro de eliminar el caso ${caso.codigoCaso}?`
    );

    if (!confirmado) {
      return;
    }

    this.mensajeError = '';
    this.eliminando = true;

    this.casoService.eliminarCaso(id).subscribe({

      next: () => {

        this.eliminando = false;
        this.obtenerCasos();

      },

      error: (error) => {

        console.error(
          'Error al eliminar caso:',
          error
        );

        if (error.status === 403) {

          this.mensajeError =
            'No tiene permisos para eliminar este caso.';

        } else if (error.status === 404) {

          this.mensajeError =
            'El caso seleccionado no existe.';

        } else {

          this.mensajeError =
            'No se pudo eliminar el caso.';

        }

        this.eliminando = false;

      }

    });

  }

  cerrarSesion() {

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);

  }

}
