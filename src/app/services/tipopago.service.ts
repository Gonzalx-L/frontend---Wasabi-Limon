import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface TipoPago {
  codTipopago: number;
  nomTipopago: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipoPagoService {
  private apiUrl = 'http://localhost:8080/api/tipopago';

  constructor(private http: HttpClient) {}

  listarTipoPagos() {
    return this.http.get<TipoPago[]>(this.apiUrl);
  }
}
