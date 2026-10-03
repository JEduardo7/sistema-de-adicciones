import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Caso } from '../../services/caso';
import { Seguimiento } from '../../services/seguimiento';

@Component({
  imports: [FormsModule],
  selector: 'app-ficha-caso',
  styleUrl: 'ficha-caso.css',
  templateUrl: 'ficha-caso.html',
})
export class FichaCaso implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly casoService = inject(Caso);
  private readonly seguimientoService = inject(Seguimiento);

  caso = signal<any | null>(null);

  seguimientos = signal<any[]>([]);

  estadoSeleccionado = '';

  mensajeError = '';

  mensajeExito = '';

  guardandoEstado = false;

  modoEdicion = false;

  guardandoEdicion = false;

  datosEdicion: any = {};

  usuarioActual = '';

  rolActual = '';

  ngOnInit() {

    const username =
      localStorage.getItem('username') || '';

    this.usuarioActual =
      this.obtenerNombreMostrar(username);

    this.rolActual =
      localStorage.getItem('role') || '';

    const id =
      this.route.snapshot.queryParamMap.get('id');

    if (!id) {

      this.mensajeError =
        'No se ha seleccionado ningún caso.';

      return;
    }

    const casoId = Number(id);

    if (isNaN(casoId) || casoId <= 0) {

      this.mensajeError =
        'El identificador del caso no es válido.';

      return;
    }

    this.obtenerCaso(casoId);

    this.obtenerSeguimientos(casoId);
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

  obtenerCaso(id: number) {

    this.casoService
      .obtenerCasoPorId(id)
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Caso obtenido:',
            respuesta
          );

          this.caso.set(respuesta);

          this.estadoSeleccionado =
            this.normalizarEstado(
              respuesta.estado
            );
        },

        error: (error) => {

          console.error(
            'Error al obtener el caso:',
            error
          );

          this.mensajeError =
            'No se pudo cargar la información del caso.';
        }

      });
  }

  obtenerSeguimientos(casoId: number) {

    this.seguimientoService
      .obtenerSeguimientosPorCaso(casoId)
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Seguimientos obtenidos:',
            respuesta
          );

          this.seguimientos.set(respuesta);
        },

        error: (error) => {

          console.error(
            'Error al obtener seguimientos:',
            error
          );

          this.seguimientos.set([]);
        }

      });
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

  activarEdicion() {

    const casoActual = this.caso();

    if (!casoActual) {

      return;
    }

    this.datosEdicion = {

      codigoCaso:
        casoActual.codigoCaso,

      fechaRegistro:
        casoActual.fechaRegistro,

      nombres:
        casoActual.nombres,

      apellidos:
        casoActual.apellidos,

      documento:
        casoActual.documento,

      edad:
        casoActual.edad,

      sexo:
        casoActual.sexo,

      sustanciaPrincipal:
        casoActual.sustanciaPrincipal,

      frecuenciaConsumo:
        casoActual.frecuenciaConsumo,

      tiempoConsumo:
        casoActual.tiempoConsumo,

      nivelRiesgo:
        casoActual.nivelRiesgo,

      diagnostico:
        casoActual.diagnostico,

      observaciones:
        casoActual.observaciones,

      estado:
        this.normalizarEstado(
          casoActual.estado
        )

    };

    this.mensajeError = '';

    this.mensajeExito = '';

    this.modoEdicion = true;
  }

  cancelarEdicion() {

    this.modoEdicion = false;

    this.guardandoEdicion = false;

    this.mensajeError = '';

  }

  guardarEdicion() {

    const casoActual = this.caso();

    if (!casoActual) {

      return;
    }

    this.mensajeError = '';

    this.mensajeExito = '';

    if (
      !this.datosEdicion.nombres ||
      !this.datosEdicion.apellidos ||
      !this.datosEdicion.documento ||
      !this.datosEdicion.edad ||
      !this.datosEdicion.sexo ||
      !this.datosEdicion.sustanciaPrincipal ||
      !this.datosEdicion.frecuenciaConsumo ||
      !this.datosEdicion.nivelRiesgo ||
      !this.datosEdicion.diagnostico ||
      !this.datosEdicion.estado
    ) {

      this.mensajeError =
        'Complete los campos obligatorios antes de guardar.';

      return;
    }

    const datosActualizados = {

      codigoCaso:
        this.datosEdicion.codigoCaso,

      fechaRegistro:
        this.datosEdicion.fechaRegistro,

      nombres:
        this.datosEdicion.nombres,

      apellidos:
        this.datosEdicion.apellidos,

      documento:
        this.datosEdicion.documento,

      edad:
        this.datosEdicion.edad,

      sexo:
        this.datosEdicion.sexo,

      sustanciaPrincipal:
        this.datosEdicion.sustanciaPrincipal,

      frecuenciaConsumo:
        this.datosEdicion.frecuenciaConsumo,

      tiempoConsumo:
        this.datosEdicion.tiempoConsumo,

      nivelRiesgo:
        this.datosEdicion.nivelRiesgo,

      diagnostico:
        this.datosEdicion.diagnostico,

      observaciones:
        this.datosEdicion.observaciones,

      estado:
        this.datosEdicion.estado

    };

    this.guardandoEdicion = true;

    this.casoService
      .actualizarCaso(
        casoActual.id,
        datosActualizados
      )
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Caso actualizado:',
            respuesta
          );

          this.caso.set(respuesta);

          this.estadoSeleccionado =
            this.normalizarEstado(
              respuesta.estado
            );

          this.mensajeExito =
            'Caso actualizado correctamente.';

          this.modoEdicion = false;

          this.guardandoEdicion = false;

        },

        error: (error) => {

          console.error(
            'Error al actualizar el caso:',
            error
          );

          if (error.status === 400) {

            this.mensajeError =
              'No se pudo actualizar el caso. Revise los datos ingresados.';

          } else if (error.status === 403) {

            this.mensajeError =
              'No tiene permisos para actualizar este caso.';

          } else if (error.status === 404) {

            this.mensajeError =
              'El caso seleccionado ya no existe.';

          } else {

            this.mensajeError =
              'No se pudo actualizar el caso. Intente nuevamente.';
          }

          this.guardandoEdicion = false;

        }

      });
  }

  actualizarEstado() {

    const casoActual = this.caso();

    if (!casoActual) {

      return;
    }

    if (!this.estadoSeleccionado) {

      this.mensajeError =
        'Seleccione un estado válido.';

      return;
    }

    this.mensajeError = '';

    this.mensajeExito = '';

    const datosActualizados = {

      codigoCaso:
        casoActual.codigoCaso,

      fechaRegistro:
        casoActual.fechaRegistro,

      nombres:
        casoActual.nombres,

      apellidos:
        casoActual.apellidos,

      documento:
        casoActual.documento,

      edad:
        casoActual.edad,

      sexo:
        casoActual.sexo,

      sustanciaPrincipal:
        casoActual.sustanciaPrincipal,

      frecuenciaConsumo:
        casoActual.frecuenciaConsumo,

      tiempoConsumo:
        casoActual.tiempoConsumo,

      nivelRiesgo:
        casoActual.nivelRiesgo,

      diagnostico:
        casoActual.diagnostico,

      observaciones:
        casoActual.observaciones,

      estado:
        this.estadoSeleccionado

    };

    this.guardandoEstado = true;

    this.casoService
      .actualizarCaso(
        casoActual.id,
        datosActualizados
      )
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Estado actualizado:',
            respuesta
          );

          this.caso.set(respuesta);

          this.estadoSeleccionado =
            this.normalizarEstado(
              respuesta.estado
            );

          this.mensajeExito =
            'Estado actualizado correctamente.';

          this.guardandoEstado = false;
        },

        error: (error) => {

          console.error(
            'Error al actualizar el estado:',
            error
          );

          if (error.status === 400) {

            this.mensajeError =
              'No se pudo actualizar el estado. Revise los datos del caso.';

          } else if (error.status === 403) {

            this.mensajeError =
              'No tiene permisos para actualizar este caso.';

          } else {

            this.mensajeError =
              'No se pudo actualizar el estado. Intente nuevamente.';
          }

          this.guardandoEstado = false;
        }

      });
  }

  normalizarEstado(valor: any): string {

    const estado =
      String(valor ?? '')
        .trim()
        .toLowerCase();

    if (estado === 'activo') {

      return 'Activo';
    }

    if (estado === 'en seguimiento') {

      return 'En seguimiento';
    }

    if (estado === 'cerrado') {

      return 'Cerrado';
    }

    return String(valor ?? '');
  }

  nuevoSeguimiento() {

    const casoActual = this.caso();

    if (!casoActual) {

      return;
    }

    this.router.navigate(
      ['/nuevo-seguimiento'],
      {
        queryParams: {
          id: casoActual.id
        }
      }
    );
  }

  volverACasos() {

    this.router.navigate(
      ['/casos']
    );
  }

  cerrarSesion() {

    localStorage.removeItem('token');

    localStorage.removeItem('username');

    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }

}
