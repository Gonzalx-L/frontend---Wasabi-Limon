import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class comidaService {

    private apiUrlComida = 'http://localhost:8080/api/comida';
    private comidaSubject = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient) { }

    listarComida(): Observable<any> {
        return this.http.get<any>(`${this.apiUrlComida}/listar`);
    }

    listarComidaPaginado(
        page: number,
        size: number,
        nomCom: string,
    ): Observable<any> {
        const params: any = {
            page,
            size
        };
        if (nomCom) params.nomCom = nomCom;

        return this.http.get<any>(`${this.apiUrlComida}/listarpage`, { params });
    }

    agregarComida(comida: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrlComida}/agregar`, comida);
    }

    editarComida(id: string, comida: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrlComida}/editar/${id}`, comida);
    }


    eliminarComida(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrlComida}/eliminar/${id}`);
    }


    buscarComidas(term: string): Observable<any[]> {
        const params = new HttpParams().set('term', term);
        return this.http.get<any[]>(`${this.apiUrlComida}/buscar`, { params });
    }

    setDatosComida(comida: any): void {
        this.comidaSubject.next(comida);
    }

    getDatosComida() {
        return this.comidaSubject.asObservable();
    }
}
