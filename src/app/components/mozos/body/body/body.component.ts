import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- AGREGA ESTO

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule, RouterModule], // <-- AGREGA RouterModule AQUÍ
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
})
export class BodyComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  getBodyClass(): string {
    if (this.collapsed && this.screenWidth > 768) {
      return 'body-trimed';
    } else if (
      this.collapsed &&
      this.screenWidth <= 768 &&
      this.screenWidth > 0
    ) {
      return 'body-md-screen';
    }
    return '';
  }
}
