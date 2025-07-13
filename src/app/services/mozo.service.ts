import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class mozoService {
    private apiUrlMozo = 'http://localhost:8080/api/mozo';
    private apiUrl = 'http://localhost:8080/api/mozo/listar';
    private mozoRefresh = new Subject<void>();
    private mozoSubject = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient) { }

    listarMozoPaginado(
        page: number,
        size: number,
        nomMoz: string,
    ): Observable<any> {
        const params: any = {
            page,
            size
        };
        if (nomMoz) params.nomMoz = nomMoz;

        return this.http.get<any>(`${this.apiUrlMozo}/listarpage`, { params });
    }

    agregarMozo(mozo: {
        nomMoz: string;
        correoMoz: string;
        contraMoz: string;
        img1Moz: string;
        cod_adm: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrlMozo}/agregar`, mozo);
    }

    editarMozo(id: string, mozo: {
        nomMoz: string;
        correoMoz: string;
        contraMoz: string;
        img1Moz: string
    }): Observable<any> {
        return this.http.put<any>(`${this.apiUrlMozo}/editar/${id}`, mozo);
    }

    eliminarMozo(codMoz: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrlMozo}/eliminar/${codMoz}`);
    }

    //refrescar cada vez que guardo o edito un mozo
    mozoRefresh$ = this.mozoRefresh.asObservable();
    emitirRefresh() {
        this.mozoRefresh.next();
    }

    setDatosMozo(mozo: any): void {
        this.mozoSubject.next(mozo);
    }

    getDatosMozo() {
        return this.mozoSubject.asObservable();
    }

    getMozos(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }


}