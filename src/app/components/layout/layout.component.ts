import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isDesktop = false;
  sidebarVisible = false;

  ngOnInit(): void {
    // Solo se ejecuta en el navegador
    if (typeof window !== 'undefined') {
      this.isDesktop = window.innerWidth >= 992;
      this.sidebarVisible = this.isDesktop;
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (typeof window !== 'undefined') {
      this.isDesktop = window.innerWidth >= 992;
      this.sidebarVisible = this.isDesktop;
    }
  }

  toggleSidebar() {
    if (!this.isDesktop) {
      this.sidebarVisible = !this.sidebarVisible;
    }
  }

  hideSidebar() {
    if (!this.isDesktop) {
      this.sidebarVisible = false;
    }
  }
}
