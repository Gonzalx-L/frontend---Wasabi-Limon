import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class reportesService {
    private apiUrlReportes = 'http://localhost:8080/api/reportes';
    private apiUrlBoleta = 'http://localhost:8080/api/boleta';
    private apiTipoCom = 'http://localhost:8080/api/tipCompro';

    constructor(private http: HttpClient) { }

    obtenerComprobantesReporte(year?: number, month?: number, day?: number): Observable<any> {
        const params: any = {};
        if (year !== undefined) params.year = year;
        if (month !== undefined) params.month = month;
        if (day !== undefined) params.day = day;

        return this.http.get(`${this.apiUrlReportes}/comprobante`, { params });
    }

    listarComprobante(): Observable<any> {
        return this.http.get<any>(`${this.apiTipoCom}/comprobante-listar`);
    }

    obtenerComprobantePorMeses(codCompro: string, year: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrlReportes}/comprobantemesesfiltro/${codCompro}/${year}`);
    }

    obtenerTipoPagoReporte(year?: number, month?: number, day?: number): Observable<any> {
        const params: any = {};
        if (year !== undefined) params.year = year;
        if (month !== undefined) params.month = month;
        if (day !== undefined) params.day = day;

        return this.http.get(`${this.apiUrlReportes}/tipopagofiltro`, { params });
    }

    listarTipoPago(): Observable<any> {
        return this.http.get<any>(`${this.apiTipoCom}/tipopago-listar`);
    }

    obtenerTipoPagoPorMeses(codTipopago: string, year: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrlReportes}/tipopagomesesfiltro/${codTipopago}/${year}`);
    }

    obtenerComidaReporte(year?: number, month?: number, day?: number): Observable<any> {
        const params: any = {};
        if (year !== undefined) params.year = year;
        if (month !== undefined) params.month = month;
        if (day !== undefined) params.day = day;

        return this.http.get(`${this.apiUrlReportes}/comidafiltromayor`, { params });
    }

    obtenerComidaReporteMenor(year?: number, month?: number, day?: number): Observable<any> {
        const params: any = {};
        if (year !== undefined) params.year = year;
        if (month !== undefined) params.month = month;
        if (day !== undefined) params.day = day;

        return this.http.get(`${this.apiUrlReportes}/comidafiltromenor`, { params });
    }

    obtenerComidaPorMeses(codCOm: string, year: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrlReportes}/comidamesesfiltro/${codCOm}/${year}`);
    }

    ObtenerIngresosReporteFiltro(year?: number, month?: number, day?: number): Observable<any> {
        const params: any = {};
        if (year !== undefined) params.year = year;
        if (month !== undefined) params.month = month;
        if (day !== undefined) params.day = day;

        return this.http.get(`${this.apiUrlReportes}/ingresofiltro`, { params });
    }

    ObtenerPropinaReporteFiltro(year?: number, month?: number, day?: number): Observable<any> {
        const params: any = {};
        if (year !== undefined) params.year = year;
        if (month !== undefined) params.month = month;
        if (day !== undefined) params.day = day;

        return this.http.get(`${this.apiUrlReportes}/propinafiltro`, { params });
    }

    contarBoletasPorFecha(fecha: string): Observable<number> {
        const params = new HttpParams().set('fecha', fecha);
        return this.http.get<number>(`${this.apiUrlBoleta}/contarfecha`, { params });
    }


}

