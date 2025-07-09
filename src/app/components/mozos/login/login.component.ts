import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { AuthService, LoginRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeInSlow', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate(
          '1200ms cubic-bezier(0.68,-0.55,0.27,1.55)',
          style({ opacity: 1, transform: 'none' })
        ),
      ]),
    ]),
  ],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  showLogin = false;
  correo = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onVideoEnded() {
    this.showLogin = true;
  }

  onSubmit() {
    const request: LoginRequest = {
      correo: this.correo,
      password: this.password
    };

    // Intenta primero como mozo
    this.authService.loginMozo(request).subscribe({
      next: (res) => {
        this.handleLoginResponse(res);
      },
      error: () => {
        // Si falla como mozo, intenta como admin
        this.authService.loginAdmin(request).subscribe({
          next: (res) => {
            this.handleLoginResponse(res);
          },
          error: () => {
            this.error = 'Correo o contraseña incorrectos';
          }
        });
      }
    });
  }

handleLoginResponse(res: any) {
  const token = res.token;
  localStorage.setItem('token', token);

  const payload = JSON.parse(atob(token.split('.')[1]));

  const roles: string[] = payload.roles;
  const rol = roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_MOZO';

  localStorage.setItem('rol', rol);

  if (rol === 'ROLE_MOZO' && payload.codMozo) {
    localStorage.setItem('codMozo', payload.codMozo); 
  }

  // Redirige según el rol
  if (rol === 'ROLE_ADMIN') {
    this.router.navigate(['/admi/inicio']);
  } else {
    this.router.navigate(['/mesas']);
  }
}

}
