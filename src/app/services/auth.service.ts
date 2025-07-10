// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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

  loginMozo(data: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/login-mozo`, data).pipe(
      tap(response => {
        localStorage.setItem('token', response.token); // Guarda el token
      })
    );
  }

  loginAdmin(data: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/login-admin`, data).pipe(
      tap(response => {
        localStorage.setItem('token', response.token); // Guarda el token
      })
    );
  }

  getToken(): string | null {
  return localStorage.getItem('token');
}


logout(): void {
  const token = localStorage.getItem('token');
  if (token) {
    this.http.post(
      `${this.backendUrl}/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'text' // texto plano
      }
    ).subscribe(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('codMozo');
    });
  }
}

}

