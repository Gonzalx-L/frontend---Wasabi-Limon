import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';

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
  imports: [CommonModule],
})
export class LoginComponent {
  showLogin = false;

  onVideoEnded() {
    this.showLogin = true;
  }

  onSubmit() {
    // lógica de login aquí
  }
}
