import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  @Output() logout = new EventEmitter<void>();

  items: SidebarItem[] = [
    { icon: 'fa-solid fa-list', label: 'Categorías', route: '/categoria' },
    {
      icon: 'fa-solid fa-users',
      label: 'Empleados',
      route: '/empleados',
      disabled: true,
    },
    {
      icon: 'fa-solid fa-chair',
      label: 'Mesas',
      route: '/mesas',
      disabled: true,
    },
    {
      icon: 'fa-solid fa-file-invoice',
      label: 'Ventas',
      route: '/ventas',
      disabled: true,
    },
  ];
}
