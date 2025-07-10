import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DetalleDTO {
  codCom: string;
  nombre?: string;
  precio?: number;
  cantidad: number;
  subtotal?: number;
}

export interface OrdenResumenDTO {
  codOr: string;
  mesa: number;
  hora: string;
  total: number;
  detalles: DetalleDTO[];
}

export interface ResumenPedidoDTO {
  codCom: string;
  cantidad: number;
}


@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private backendUrl = 'http://localhost:8080/api/ordenes';

  constructor(private http: HttpClient) {}

  listarResumenPorMozo(codMoz: string): Observable<OrdenResumenDTO[]> {
    return this.http.get<OrdenResumenDTO[]>(`${this.backendUrl}/resumen/mozo/${codMoz}`);
  }

listarPorMozoYEstado(codMoz: string, estado: string): Observable<OrdenResumenDTO[]> {
  return this.http.get<OrdenResumenDTO[]>(`${this.backendUrl}/resumen/mozo/${codMoz}/estado/${estado}`);
}
  editarOrden(id: string, orden: ResumenPedidoDTO[]): Observable<void> {
    return this.http.put<void>(`${this.backendUrl}/mozo/${id}/editar`, orden);
  }

  marcarComoPagado(id: string): Observable<void> {
    return this.http.put<void>(`${this.backendUrl}/pagar/${id}`, null);
  }

  anularOrden(id: string): Observable<void> {
    return this.http.put<void>(`${this.backendUrl}/anular/${id}`, null);
  }
}
