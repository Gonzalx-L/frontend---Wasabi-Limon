import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface ResumenPedidoDTO {
  codCom: string;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private baseMesaUrl = 'http://localhost:8080/api/mesas';
  private baseOrdenUrl = 'http://localhost:8080/api/ordenes';
  private countSubject = new BehaviorSubject<number>(0);
  count$ = this.countSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshCount();
  }

 
  private getMesaSeleccionada(): number {
    return Number(localStorage.getItem('mesaSeleccionada'));
  }

  refreshCount(): void {
    const mesa = this.getMesaSeleccionada();
    if (mesa) {
      this.getPedido().subscribe((pedido) => {
        const total = Object.values(pedido).reduce(
          (sum, cantidad) => sum + (cantidad as number),
          0
        );
        this.countSubject.next(total);
      });
    } else {
      this.countSubject.next(0);
    }
  }

  add(codCom: string): Observable<void> {
    const mesa = this.getMesaSeleccionada();
    return this.http
      .post<void>(`${this.baseMesaUrl}/${mesa}/carrito/agregar/${codCom}`, {})
      .pipe(tap(() => this.refreshCount()));
  }

  remove(codCom: string): Observable<void> {
    const mesa = this.getMesaSeleccionada();
    return this.http
      .post<void>(`${this.baseMesaUrl}/${mesa}/carrito/quitar/${codCom}`, {})
      .pipe(tap(() => this.refreshCount()));
  }


  getPedido(): Observable<{ [codCom: string]: number }> {
    const mesa = this.getMesaSeleccionada();
    return this.http.get<{ [codCom: string]: number }>(
      `${this.baseMesaUrl}/${mesa}/carrito`
    );
  }


  getResumen(): Observable<ResumenPedidoDTO[]> {


    const mesa = this.getMesaSeleccionada();

    return this.http.get<ResumenPedidoDTO[]>(
      `${this.baseMesaUrl}/${mesa}/carrito/resumen`
    );
  }

  cancelOrder(): Observable<void> {
    const mesa = this.getMesaSeleccionada();
    return this.http
      .delete<void>(`${this.baseMesaUrl}/${mesa}/carrito`)
      .pipe(tap(() => this.refreshCount()));
  }


  confirmOrder(codMozo: string): Observable<void> {
    const mesa = this.getMesaSeleccionada();
    return this.http
      .post<void>(
        `${this.baseOrdenUrl}/confirmar?numeroMesa=${mesa}&codMozo=${codMozo}`,
        {}
      )
      .pipe(tap(() => this.refreshCount()));
  }
}
