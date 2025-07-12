import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PropinasService {
  private apiUrl = 'http://localhost:8080/api/reportes/propinafiltro';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las propinas filtradas por mozo, año, mes y día.
   * @param filtro Objeto con { codMoz, year, month, day }
   */
  getPropinas(filtro: any): Observable<any[]> {
    let params = new HttpParams();
    if (filtro.codMoz) params = params.set('codMoz', filtro.codMoz);
    if (filtro.year) params = params.set('year', filtro.year);
    if (filtro.month) params = params.set('month', filtro.month);
    if (filtro.day) params = params.set('day', filtro.day);

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
