import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MesaTemporal {
  estado: string;
  codMozo: string | null;
  pedidoTemporal: { [codCom: string]: number };
}

@Injectable({ providedIn: 'root' })
export class MesaService {
  private apiUrl = 'http://localhost:8080/api/mesas';

  constructor(private http: HttpClient) {}

  getMesas(): Observable<{ [numero: number]: MesaTemporal }> {
    return this.http.get<{ [numero: number]: MesaTemporal }>(
      `${this.apiUrl}/estados`
    );
  }

  atenderMesa(numero: number, codMozo: string) {
    return this.http.post<void>(`${this.apiUrl}/${numero}/atender`, null, {
      params: { codMozo },
    });
  }

  liberarMesa(numero: number) {
    return this.http.post<void>(`${this.apiUrl}/${numero}/liberar`, {});
  }

  agregarPlato(numero: number, codCom: string) {
    return this.http.post<void>(
      `${this.apiUrl}/${numero}/carrito/agregar/${codCom}`,
      {}
    );
  }

  quitarPlato(numero: number, codCom: string) {
    return this.http.post<void>(
      `${this.apiUrl}/${numero}/carrito/quitar/${codCom}`,
      {}
    );
  }

  verCarrito(numero: number): Observable<{ [codCom: string]: number }> {
    return this.http.get<{ [codCom: string]: number }>(
      `${this.apiUrl}/${numero}/carrito`
    );
  }

  limpiarCarrito(numero: number) {
    return this.http.delete<void>(`${this.apiUrl}/${numero}/carrito`);
  }
}
