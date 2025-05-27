import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CartService, ResumenPedidoDTO } from '../../services/cart.service';

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

  showCart = false;
  cartDetalle: ResumenPedidoDTO[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
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
    if (!this.isDesktop) this.sidebarVisible = !this.sidebarVisible;
  }

  hideSidebar() {
    if (!this.isDesktop) this.sidebarVisible = false;
  }

  onOpenCart(): void {
    this.showCart = true;
    this.cartService
      .getResumen()
      .subscribe((list) => (this.cartDetalle = list));
  }

  onCloseCart(): void {
    this.showCart = false;
  }

  onAdd(item: ResumenPedidoDTO): void {
    this.cartService.add(item.codCom).subscribe(() => this.onOpenCart());
  }

  onRemove(item: ResumenPedidoDTO): void {
    this.cartService.remove(item.codCom).subscribe(() => this.onOpenCart());
  }

  onCancel(): void {
    this.cartService.cancelOrder().subscribe(() => this.onCloseCart());
  }

  onConfirm(): void {
    this.cartService.confirmOrder().subscribe(() => this.onCloseCart());
  }
}
