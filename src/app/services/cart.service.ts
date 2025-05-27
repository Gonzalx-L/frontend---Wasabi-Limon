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
  private baseUrl = 'http://localhost:8080/api/pedido-temporal';
  private countSubject = new BehaviorSubject<number>(0);
  count$ = this.countSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshCount();
  }

  refreshCount(): void {
    this.http
      .get<number>(`${this.baseUrl}/count`)
      .subscribe((n) => this.countSubject.next(n));
  }

  add(codCom: string): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/agregar/${codCom}`, {})
      .pipe(tap(() => this.refreshCount()));
  }

  remove(codCom: string): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/quitar/${codCom}`, {})
      .pipe(tap(() => this.refreshCount()));
  }

  getResumen(): Observable<ResumenPedidoDTO[]> {
    return this.http.get<ResumenPedidoDTO[]>(`${this.baseUrl}/resumen`);
  }

  cancelOrder(): Observable<void> {
    return this.http
      .delete<void>(this.baseUrl)
      .pipe(tap(() => this.refreshCount()));
  }

  confirmOrder(): Observable<void> {
    return this.http
      .post<void>('http://localhost:8080/api/ordenes/confirmar', {})
      .pipe(tap(() => this.refreshCount()));
  }
}
