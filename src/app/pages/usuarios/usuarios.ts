import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLink],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  usuarios = signal<any[]>([]);

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

    this.obtenerUsuarios();
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

  obtenerUsuarios() {

    this.mensajeError = '';

    this.http
      .get<any[]>(
        'https://sistema-de-adicciones-api-rest.onrender.com/api/usuarios'
      )
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Usuarios obtenidos:',
            respuesta
          );

          this.usuarios.set(respuesta);

        },

        error: (error) => {

          console.error(
            'Error al obtener usuarios:',
            error
          );

          if (error.status === 403) {

            this.mensajeError =
              'No tiene permisos para acceder a la gestión de usuarios.';

          } else {

            this.mensajeError =
              'No se pudieron cargar los usuarios.';

          }

          this.usuarios.set([]);

        }

      });

  }

  volverDashboard() {

    this.router.navigate(['/dashboard']);

  }

  cerrarSesion() {

    localStorage.removeItem('token');

    localStorage.removeItem('username');

    localStorage.removeItem('role');

    this.router.navigate(['/login']);

  }

}
