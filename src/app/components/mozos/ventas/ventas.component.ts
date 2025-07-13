import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenService, OrdenResumenDTO, ResumenPedidoDTO, DetalleDTO } from '../../../services/orden.service';
@Component({
  selector: 'app-ventas',
  imports: [CommonModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss',
})
export class VentasComponent implements OnInit {

  codMoz = localStorage.getItem('codMozo') || '0000';
  estado = 'PAGADO'; // estado a filtrar
  ordenes: OrdenResumenDTO[] = [];
  error = '';
  cargando = false;
  mostrarCargando = false;

  constructor(private ordenService: OrdenService) {}
  ngOnInit() {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.cargando = true;
    this.ordenService.listarPorMozoYEstado(this.codMoz, this.estado).subscribe({
      next: (data) => {
        this.ordenes = data;
        setTimeout(() => {
          this.cargando = false;
          this.mostrarCargando = false;
        }, 3000);
      },
      error: (err) => {
        this.error = 'Error al cargar órdenes';
        setTimeout(() => {
          this.cargando = false;
          this.mostrarCargando = false;
        }, 3000);
      }
    });
  }
}