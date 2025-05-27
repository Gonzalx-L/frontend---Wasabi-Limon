import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private apiUrl = 'http://localhost:8080/api/categorias';

  constructor(private http: HttpClient) {}

  listarNombres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/nombres`);
  }
  listarPlatosPorCategoria(codCat: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${codCat}/comidas`);
  }
}
