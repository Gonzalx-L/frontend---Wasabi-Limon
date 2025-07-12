// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {}

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

  tieneMesasAtendidas(codMozo: string): Observable<boolean> {
  return this.http.get<boolean>(`http://localhost:8080/api/mesas/mozo/${codMozo}/tiene-atendidas`);
}

logout() {
  const codMozo = localStorage.getItem('codMozo');

  if (!codMozo) {
    this.realizarLogout(); // Si no hay mozo (es admin), cerrar sesión normalmente
    return;
  }

  this.tieneMesasAtendidas(codMozo).subscribe({
    next: (tieneMesas) => {
      if (tieneMesas) {
        alert('No puedes cerrar sesión porque tienes mesas en estado ATENDIDA');
      } else {
        this.realizarLogout();
      }
    },
    error: () => {
      alert('Error al verificar mesas atendidas');
    }
  });
}

private realizarLogout() {
  localStorage.removeItem('rol');
  localStorage.removeItem('codMozo');
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}

}