// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface Mozo {
  codMoz: string;
  nomMoz: string;
  correoMoz: string;
  img1Moz_base64?: string;
}

export interface Administrador {
  codAdm: string;
  nomAdm: string;
  correoAdm: string;
  img1Adm_base64?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  loginMozo(data: LoginRequest): Observable<Mozo> {
    return this.http.post<Mozo>(`${this.backendUrl}/login-mozo`, data);
  }

  loginAdmin(data: LoginRequest): Observable<Administrador> {
    return this.http.post<Administrador>(`${this.backendUrl}/login-admin`, data);
  }
}
