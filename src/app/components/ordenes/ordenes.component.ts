import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenService, OrdenResumenDTO, ResumenPedidoDTO, DetalleDTO } from '../../services/orden.service';

@Component({
  selector: 'app-ordenes',
  imports: [CommonModule],
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.scss',
})
export class OrdenesComponent implements OnInit {

  codMoz = '0001'; // por ejemplo, mozo fijo
  estado = 'PENDIENTE'; // estado a filtrar
  ordenes: OrdenResumenDTO[] = [];
  error = '';
  cargando = false;
  mostrarCargando = false;

  constructor(private ordenService: OrdenService) {}


  cargarOrdenes() {
    this.cargando = true;
    this.mostrarCargando = true;
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

  cambiarCantidad(event: Event, orden: OrdenResumenDTO, detalle: DetalleDTO) {
  const input = event.target as HTMLInputElement;
  if (input && input.value) {
    const cantidad = parseInt(input.value, 10);
    if (!isNaN(cantidad) && cantidad > 0) {
      detalle.cantidad = cantidad;
      detalle.subtotal = detalle.precio! * cantidad;
      this.actualizarTotal(orden);
    }
  }
  }

  // Recalcula total
  private actualizarTotal(orden: OrdenResumenDTO) {
    orden.total = orden.detalles.reduce((acc, d) => acc + (d.precio! * d.cantidad), 0);
  }

  // Guardar cambios
  guardarCambios(orden: OrdenResumenDTO) {
  const nuevosDetalles: ResumenPedidoDTO[] = orden.detalles.map(d => ({
    codCom: d.codCom,
    cantidad: d.cantidad
  }));

  this.ordenService.editarOrden(orden.codOr, nuevosDetalles).subscribe({
    next: () => alert('Orden actualizada correctamente'),
    error: (err) => {
      console.error('Error detallado:', err);
      alert('Error al actualizar la orden: ' + (err?.error?.message || err.message || 'Error desconocido'));
    }
  });
}

  // Marcar como pagado
  pagarOrden(codOr: string) {
    this.ordenService.marcarComoPagado(codOr).subscribe({
      next: () => {
        alert('Orden marcada como pagada');
        this.cargarOrdenes();
      },
      error: () => alert('Error al marcar como pagada')
    });
  }

  // Anular orden
  anularOrden(codOr: string) {
    this.ordenService.anularOrden(codOr).subscribe({
      next: () => {
        alert('Orden anulada');
        this.cargarOrdenes();
      },
      error: () => alert('Error al anular la orden')
    });
  }
  ngOnInit() {
    this.cargarOrdenes();
  }
}
