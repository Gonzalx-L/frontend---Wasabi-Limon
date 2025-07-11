import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class comidaService {

    private apiUrlComida = 'http://localhost:8080/api/comida';

    constructor(private http: HttpClient) { }

    listarComida(): Observable<any> {
        return this.http.get<any>(`${this.apiUrlComida}/listar`);
    }

    buscarComidas(term: string): Observable<any[]> {
        const params = new HttpParams().set('term', term);
        return this.http.get<any[]>(`${this.apiUrlComida}/buscar`, { params });
    }
}
