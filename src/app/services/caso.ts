import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Caso {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://sistema-de-adicciones-api-rest.onrender.com/api/casos';

  obtenerCasos() {
    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  obtenerCasoPorId(id: number) {
    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  registrarCaso(datos: any) {
    return this.http.post<any>(
      this.apiUrl,
      datos
    );
  }

  actualizarCaso(id: number, datos: any) {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      datos
    );
  }

  eliminarCaso(id: number) {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
