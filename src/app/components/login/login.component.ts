import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  correo = '';
  password = '';
  tipoUsuario = 'mozo';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const request: LoginRequest = {
      correo: this.correo,
      password: this.password
    };

    if (this.tipoUsuario === 'mozo') {
      this.authService.loginMozo(request).subscribe({
        next: (mozo) => {
          console.log('Login exitoso del mozo:', mozo);
          this.router.navigate(['/categoria']);
        },
        error: () => {
          this.error = 'Usuario o contraseña incorrectos (mozo)';
        }
      });
    } else if (this.tipoUsuario === 'admin') {
      this.authService.loginAdmin(request).subscribe({
        next: (admin) => {
          console.log('Login exitoso del administrador:', admin);
          this.router.navigate(['/categoria']);
        },
        error: () => {
          this.error = 'Usuario o contraseña incorrectos (admin)';
        }
      });
    }
  }
}
