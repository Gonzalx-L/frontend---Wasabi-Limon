import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Comprobante {
  codCompro: number;
  nomCompro: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {
  private apiUrl = 'http://localhost:8080/api/comprobante';

  constructor(private http: HttpClient) {}

  listarComporbantes() {
    return this.http.get<Comprobante[]>(this.apiUrl);
  }
}
