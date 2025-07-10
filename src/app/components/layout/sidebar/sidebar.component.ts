import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

interface SidebarItem {
  icon: string;
  label: string;
  route: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() expanded = true;
  @Output() toggle = new EventEmitter<void>();

    constructor(private authService: AuthService, private router: Router) {}

  items: SidebarItem[] = [
    {
      icon: 'fa-solid fa-chair',
      label: 'Mesas',
      route: '/mesas',
    },
    { icon: 'fa-solid fa-list', 
      label: 'Categorías', 
      route: '/categoria' },
    {
      icon: 'fa-solid fa-file-invoice',
      label: 'Órdenes',
      route: '/ordenes',
      disabled: true,
    },
    {
      icon: 'fa-solid fa-file-invoice',
      label: 'Ventas',
      route: '/ventas',
      disabled: true,
    },
  ];

  logout() {
    this.authService.logout();
    localStorage.removeItem('rol');
    localStorage.removeItem('codMozo');
    this.router.navigate(['/login']);
  }
}
