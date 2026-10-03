import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Seguimiento } from '../../services/seguimiento';
import { Caso } from '../../services/caso';

@Component({
  imports: [FormsModule],
  selector: 'app-nuevo-seguimiento',
  styleUrl: 'nuevo-seguimiento.css',
  templateUrl: 'nuevo-seguimiento.html',
})
export class NuevoSeguimiento implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seguimientoService = inject(Seguimiento);
  private readonly casoService = inject(Caso);
  private readonly changeDetector = inject(ChangeDetectorRef);

  casoId = 0;
  codigoCaso = '';
  nombrePaciente = '';

  fechaSeguimiento = '';
  profesional = '';
  tipoSeguimiento = '';
  descripcion = '';
  acuerdos = '';
  resultado = '';

  usuarioActual = '';
  rolActual = '';

  mensajeError = '';
  guardando = false;

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

    this.casoId =
      Number(id);

    this.profesional =
      username;

    this.fechaSeguimiento =
      this.obtenerFechaLocal();

    this.obtenerDatosCaso();

    this.changeDetector.detectChanges();
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

  obtenerDatosCaso() {

    this.casoService
      .obtenerCasoPorId(this.casoId)
      .subscribe({

        next: (caso) => {

          this.codigoCaso =
            caso.codigoCaso || '';

          this.nombrePaciente =
            `${caso.nombres || ''} ${caso.apellidos || ''}`
              .trim();

          this.changeDetector.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al obtener los datos del caso:',
            error
          );

          this.mensajeError =
            'No se pudo cargar la información del caso.';

          this.changeDetector.detectChanges();
        }

      });
  }

  obtenerFechaLocal(): string {

    const hoy = new Date();

    const anio =
      hoy.getFullYear();

    const mes =
      String(hoy.getMonth() + 1).padStart(2, '0');

    const dia =
      String(hoy.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  guardarSeguimiento() {

    this.mensajeError = '';

    if (
      !this.fechaSeguimiento ||
      !this.profesional.trim() ||
      !this.tipoSeguimiento.trim() ||
      !this.descripcion.trim() ||
      !this.acuerdos.trim() ||
      !this.resultado.trim()
    ) {

      this.mensajeError =
        'Complete todos los campos obligatorios.';

      return;
    }

    const datos = {

      casoId:
        this.casoId,

      fechaSeguimiento:
        this.fechaSeguimiento,

      profesional:
        this.profesional.trim(),

      tipoSeguimiento:
        this.tipoSeguimiento,

      descripcion:
        this.descripcion.trim(),

      acuerdos:
        this.acuerdos.trim(),

      resultado:
        this.resultado.trim()

    };

    this.guardando = true;

    this.seguimientoService
      .registrarSeguimiento(datos)
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Seguimiento registrado:',
            respuesta
          );

          this.router.navigate(
            ['/ficha-caso'],
            {
              queryParams: {
                id: this.casoId
              }
            }
          );
        },

        error: (error) => {

          console.error(
            'Error al registrar seguimiento:',
            error
          );

          if (error.status === 400) {

            this.mensajeError =
              'Revise los datos ingresados. Algunos campos no son válidos.';

          } else if (error.status === 403) {

            this.mensajeError =
              'No tiene permisos para registrar el seguimiento.';

          } else {

            this.mensajeError =
              'No se pudo registrar el seguimiento.';
          }

          this.guardando = false;

          this.changeDetector.detectChanges();
        }

      });
  }

  cancelar() {

    this.router.navigate(
      ['/ficha-caso'],
      {
        queryParams: {
          id: this.casoId
        }
      }
    );
  }

  cerrarSesion() {

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }

}
