// src/app/services/mozo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MozoService {
  private apiUrl = 'http://localhost:8080/api/mozo/listar';

  constructor(private http: HttpClient) {}

  getMozos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
