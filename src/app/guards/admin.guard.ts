import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = this.authService.getToken();
    const rol = localStorage.getItem('rol');
    if (token && rol === 'ROLE_ADMIN') {
      return true;
    } else {
      return this.router.parseUrl('/login');
    }
  }
}
