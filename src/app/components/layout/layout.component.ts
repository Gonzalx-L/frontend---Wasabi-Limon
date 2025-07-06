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
  sidebarExpanded = true;
  showCart = false;
  cartDetalle: ResumenPedidoDTO[] = [];
  cartCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.sidebarExpanded = window.innerWidth >= 992;
    this.cartService.count$.subscribe((n) => (this.cartCount = n));
  }

  @HostListener('window:resize')
  onResize() {
    this.sidebarExpanded = window.innerWidth >= 992;
  }

  onToggleSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
  onLogout() {
    window.location.href = '/login';
  }

  // Modal Carrito
  onOpenCart() {
    this.showCart = true;
    this.cartService
      .getResumen()
      .subscribe((list) => (this.cartDetalle = list));
  }
  onCloseCart() {
    this.showCart = false;
  }
  onAdd(item: ResumenPedidoDTO) {
    this.cartService.add(item.codCom).subscribe(() => this.onOpenCart());
  }
  onRemove(item: ResumenPedidoDTO) {
    this.cartService.remove(item.codCom).subscribe(() => this.onOpenCart());
  }
  onCancel() {
    this.cartService.cancelOrder().subscribe(() => this.onCloseCart());
  }
  onConfirm() {
    this.cartService.confirmOrder().subscribe(() => this.onCloseCart());
  }

  getContentMargin(): string {
    return this.sidebarExpanded ? '16rem' : '5rem';
  }
}
