import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Caso } from '../../services/caso';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-nuevo-caso',
  styleUrl: 'nuevo-caso.css',
  templateUrl: 'nuevo-caso.html',
})
export class NuevoCaso implements OnInit {

  private readonly casoService = inject(Caso);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);

  codigoCaso = '';
  nombres = '';
  apellidos = '';
  documento = '';
  edad: number | null = null;
  sexo = '';
  fechaRegistro = '';
  sustanciaPrincipal = '';
  frecuenciaConsumo = '';
  tiempoConsumo = '';
  nivelRiesgo = '';
  estado = 'Activo';
  diagnostico = '';
  observaciones = '';

  profesional = '';
  esAdministrador = false;

  usuarioActual = '';
  rolActual = '';

  profesionales = [
    { nombre: 'Iván David Asencio Julcamoro', codigo: 'N00404657' },
    { nombre: 'Eder Guerrero Carranza', codigo: 'N00455009' },
    { nombre: 'José Eduardo Ruiz Castillo', codigo: 'N00032972' },
    { nombre: 'Nelver Vigo Cabanillas', codigo: 'N00400282' }
  ];

  mensajeError = '';
  guardando = false;
  intentoGuardar = false;

  ngOnInit(): void {
    const username = localStorage.getItem('username') || '';

    this.usuarioActual = this.obtenerNombreMostrar(username);
    this.rolActual = localStorage.getItem('role') || '';

    this.configurarProfesional();
    this.fechaRegistro = this.obtenerFechaLocal();
    this.generarCodigoCaso();
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

  configurarProfesional(): void {
    const username = localStorage.getItem('username') || '';
    const rol = this.rolActual.trim().toLowerCase();

    const profesionalActual = this.profesionales.find(
      profesional => profesional.codigo === username
    );

    if (profesionalActual) {
      this.profesional = profesionalActual.codigo;
      this.esAdministrador = false;
      return;
    }

    this.esAdministrador =
      rol.includes('admin') || username === '11111111';

    this.profesional = '';
  }

  obtenerFechaLocal(): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  cambiarProfesional(): void {
    this.mensajeError = '';
    this.codigoCaso = '';

    if (this.esAdministrador && !this.profesional) {
      return;
    }

    this.generarCodigoCaso();
  }

  generarCodigoCaso(): void {
    if (this.esAdministrador && !this.profesional) {
      this.codigoCaso = '';
      return;
    }

    this.codigoCaso = '';

    this.casoService.obtenerCasos().subscribe({
      next: (casos) => {
        const casosDelProfesional = casos.filter(
          caso => String(caso.profesional || '') === this.profesional
        );

        const numeros = casosDelProfesional
          .map(caso => {
            const codigo = String(caso.codigoCaso || '');
            const coincidencia = codigo.match(/^CASO-(\d+)$/);

            return coincidencia ? Number(coincidencia[1]) : 0;
          })
          .filter(numero => Number.isFinite(numero));

        const numeroMayor = numeros.length
          ? Math.max(...numeros)
          : 0;

        this.codigoCaso =
          `CASO-${String(numeroMayor + 1).padStart(4, '0')}`;

        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Error al generar código del caso:', error);

        this.codigoCaso = '';
        this.mensajeError =
          'No se pudo obtener el código del caso. Intente nuevamente.';

        this.changeDetector.detectChanges();
      }
    });
  }

  campoVacio(valor: string | number | null): boolean {
    return valor === null ||
      valor === undefined ||
      String(valor).trim() === '';
  }

  guardarCaso(): void {
    if (this.guardando) {
      return;
    }

    this.mensajeError = '';
    this.intentoGuardar = true;

    const camposIncompletos =
      this.campoVacio(this.codigoCaso) ||
      this.campoVacio(this.nombres) ||
      this.campoVacio(this.apellidos) ||
      this.campoVacio(this.documento) ||
      this.edad === null ||
      this.campoVacio(this.sexo) ||
      this.campoVacio(this.fechaRegistro) ||
      this.campoVacio(this.sustanciaPrincipal) ||
      this.campoVacio(this.frecuenciaConsumo) ||
      this.campoVacio(this.tiempoConsumo) ||
      this.campoVacio(this.nivelRiesgo) ||
      this.campoVacio(this.estado) ||
      this.campoVacio(this.diagnostico) ||
      this.campoVacio(this.observaciones) ||
      (this.esAdministrador && this.campoVacio(this.profesional));

    if (camposIncompletos) {
      this.mensajeError = 'Complete todos los campos obligatorios.';
      this.changeDetector.detectChanges();

      setTimeout(() => {
        const primerCampoInvalido =
          document.querySelector<HTMLElement>(
            '.caso-form .campo-invalido'
          );

        if (primerCampoInvalido) {
          primerCampoInvalido.focus();
          primerCampoInvalido.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      });

      return;
    }

    const edadNumerica = Number(this.edad);

    if (
      !Number.isFinite(edadNumerica) ||
      !Number.isInteger(edadNumerica) ||
      edadNumerica < 0
    ) {
      this.mensajeError =
        'Ingrese una edad válida, expresada en años completos.';
      return;
    }

    if (this.esAdministrador && !this.profesional) {
      this.mensajeError =
        'Seleccione el profesional responsable del caso.';
      return;
    }

    const datosCaso = {
      codigoCaso: this.codigoCaso,
      nombres: this.nombres.trim(),
      apellidos: this.apellidos.trim(),
      documento: this.documento.trim(),
      edad: edadNumerica,
      sexo: this.sexo,
      fechaRegistro: this.fechaRegistro,
      sustanciaPrincipal: this.sustanciaPrincipal.trim(),
      frecuenciaConsumo: this.frecuenciaConsumo,
      tiempoConsumo: this.tiempoConsumo.trim(),
      nivelRiesgo: this.nivelRiesgo,
      estado: this.estado,
      diagnostico: this.diagnostico.trim(),
      observaciones: this.observaciones.trim(),
      profesional: this.profesional
    };

    this.guardando = true;

    this.casoService.registrarCaso(datosCaso).subscribe({
      next: (respuesta) => {
        console.log('Caso registrado:', respuesta);
        this.router.navigate(['/casos']);
      },
      error: (error) => {
        console.error('Error al registrar caso:', error);

        if (error.status === 400) {
          this.mensajeError =
            'Revise los datos ingresados. Algunos campos no son válidos.';
        } else if (error.status === 409) {
          this.mensajeError =
            'El código del caso o documento ya existe.';
        } else {
          this.mensajeError =
            'No se pudo registrar el caso. Intente nuevamente.';
        }

        this.guardando = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/casos']);
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }
}
