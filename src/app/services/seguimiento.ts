import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Seguimiento {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://sistema-de-adicciones-api-rest.onrender.com/api/seguimientos';

  obtenerSeguimientosPorCaso(casoId: number) {

    return this.http.get<any[]>(
      `${this.apiUrl}/caso/${casoId}`
    );

  }

  obtenerTodosLosSeguimientos() {

    return this.http.get<any[]>(
      this.apiUrl
    );

  }

  registrarSeguimiento(datos: any) {

    return this.http.post<any>(
      this.apiUrl,
      datos
    );

  }

  actualizarSeguimiento(id: number, datos: any) {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      datos
    );

  }

  eliminarSeguimiento(id: number) {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}
