import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BoletaService {
    private apiUrl = 'http://localhost:8080/api/boleta';

    constructor(private http: HttpClient) { }

    listarBoletasPaginado(
        page: number,
        size: number,
        filtros: {
            codMoz?: string,
            total1?: number,
            total2?: number,
            horaInicio?: string,
            horaFin?: string,
            fechaInicio?: string,
            fechaFin?: string
        } = {}
    ): Observable<any> {
        const params: any = {
            page,
            size
        };

        // Agregamos solo los filtros definidos
        if (filtros.codMoz) params.codMoz = filtros.codMoz;
        if (filtros.total1 !== undefined) params.total1 = filtros.total1;
        if (filtros.total2 !== undefined) params.total2 = filtros.total2;
        if (filtros.horaInicio) params.horaInicio = filtros.horaInicio;
        if (filtros.horaFin) params.horaFin = filtros.horaFin;
        if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
        if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;

        return this.http.get<any>(`${this.apiUrl}/listar`, { params });
    }

    obtenerDetalleBoleta(codBol: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/detallebol/${codBol}`);
    }

    obtenerDetalleComidas(codOr: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/detallecom/${codOr}`);
    }
}