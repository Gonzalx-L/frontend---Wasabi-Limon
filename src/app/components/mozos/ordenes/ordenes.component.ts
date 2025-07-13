import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenService, OrdenResumenDTO, ResumenPedidoDTO, DetalleDTO } from '../../../services/orden.service';
import { MesaService, MesaTemporal } from '../../../services/mesa.service';
import { BoletaForm } from '../../../services/boleta.service';
import { FormsModule } from '@angular/forms';
import { TipoPagoService, TipoPago } from '../../../services/tipopago.service';
import { Comprobante, ComprobanteService } from '../../../services/comprobante.service';


@Component({
  selector: 'app-ordenes',
  imports: [CommonModule, FormsModule],
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.scss',
})
export class OrdenesComponent implements OnInit {

  mesas: { [numero: number]: MesaTemporal } = {};
  codMoz = localStorage.getItem('codMozo') || '0000';
  estado = 'PENDIENTE'; // estado a filtrar
  ordenes: OrdenResumenDTO[] = [];
  error = '';
  cargando = false;
  mostrarCargando = false;
  tiposPago: TipoPago[] = [];
  comprobantes: Comprobante[] = [];
  
  boletaForm: BoletaForm = {
    codOr: '',
    tipoPago:  1,
    propina: 0,
    comprobante: 1,
  };
  mostrarFormularioBoleta = false;

  
  constructor(private ordenService: OrdenService, private tipoPagoService: TipoPagoService, private comprobanteService: ComprobanteService, private mesaService: MesaService) {}


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

abrirFormularioBoleta(orden: OrdenResumenDTO) {
  this.boletaForm = {
    codOr: orden.codOr,
    tipoPago: this.tiposPago.length > 0 ? this.tiposPago[0].codTipopago : 1,
    comprobante: this.comprobantes.length > 0 ? this.comprobantes[0].codCompro : 1,
    propina: 0,
    nomCli: '',
    dniCli: '',
    rucCli: '',
    numCli: '',
    correoCli: ''
  };
  this.mostrarFormularioBoleta = true;
}

  cerrarFormularioBoleta() {
    this.mostrarFormularioBoleta = false;
  }

  confirmarPago() {
    this.ordenService.generarBoleta(this.boletaForm).subscribe({
    next: () => {
      alert('Boleta generada correctamente');
      this.mostrarFormularioBoleta = false;

      const numeroMesa = localStorage.getItem('mesaSeleccionada');
      if (numeroMesa) {
        // Llamar a liberarMesa desde el servicio
        this.mesaService.liberarMesa(+numeroMesa).subscribe({
          next: () => {
            localStorage.removeItem('mesaSeleccionada'); // Limpia localStorage
            this.cargarOrdenes(); // Refresca vista
          },
          error: () => {
            console.error('Error al liberar la mesa');
            alert('Boleta generada, pero ocurrió un error al liberar la mesa');
          }
        });
      } else {
        this.cargarOrdenes(); // fallback
      }
    },
    error: () => alert('Error al generar boleta')
  });
  }

    // abrir formulario
  pagarOrden(orden: OrdenResumenDTO) {
    this.abrirFormularioBoleta(orden);
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

  cargarTiposPago() {
    this.tipoPagoService.listarTipoPagos().subscribe({
      next: (data) => this.tiposPago = data,
      error: () => console.error('Error al cargar tipos de pago')
    });
  }

  cargarComprobantes() {
    this.comprobanteService.listarComporbantes().subscribe({
      next: (data) => this.comprobantes = data,
      error: () => console.error('Error al cargar comprobantes')
    });
  }

  ngOnInit() {
    this.cargarOrdenes();
    this.cargarTiposPago();
    this.cargarComprobantes();
  }
}
