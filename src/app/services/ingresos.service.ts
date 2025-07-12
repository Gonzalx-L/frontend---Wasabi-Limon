// src/app/services/ingresos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IngresosService {
  private apiUrl = 'http://localhost:8080/api/reportes/comprobante';

  constructor(private http: HttpClient) {}

  getIngresos(filtro: any): Observable<any[]> {
    let params = new HttpParams();
    if (filtro.year) params = params.set('year', filtro.year);
    if (filtro.month) params = params.set('month', filtro.month);
    if (filtro.day) params = params.set('day', filtro.day);
    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
