import { Component, OnInit } from '@angular/core';
import { FiltrosComponent } from "./filtros/filtros.component";
import { CommonModule } from '@angular/common';
import { BoletaService } from '../../../services/boleta.service';
import { ModalService } from '../../../services/modal.service';
import { CdkMenuModule } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-boletas',
  imports: [FiltrosComponent, CommonModule, CdkMenuModule, OverlayModule, FormsModule],
  templateUrl: './boletas.component.html',
  styleUrls: ['./boletas.component.scss']
})
export class BoletasComponent implements OnInit {
  listarBoleta: any[] = [];
  paginaActual: number = 1;
  totalPaginas: number = 0;
  tamanioPagina: number = 5;
  maxPaginasVisibles: number = 3;
  filtros: any = {}; // Almacena los filtros recibidos
  selectedBoleta: string | null = null;
  canShowSearchAsOverlay = false;
  codBol: string = '';

  constructor(private boletaService: BoletaService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.cargarBoletas();
  }

  openModal(boleta: any): void {
    this.modalService.setDatosBoleta(boleta);
    this.modalService.showModal('modal');
  }

  openModalSearch(): void {
    const txtCodBol = this.codBol;
    if (!txtCodBol || txtCodBol.trim() === '') {
      alert('Por favor, ingrese el código de la boleta');
      return;
    }
    this.boletaService.obtenerDetalleBoleta(txtCodBol).subscribe({
      next: data => {
        this.modalService.setCodBol(txtCodBol);
        this.modalService.showModal('modal');
        
      },
      error: err => {
        alert('El codigo de la boleta no existe')
      }
    });
  }

  cargarBoletas(): void {
    this.boletaService.listarBoletasPaginado(this.paginaActual, this.tamanioPagina, this.filtros)
      .subscribe(
        (respuesta: any) => {
          this.listarBoleta = respuesta.content;
          this.totalPaginas = respuesta.totalPages;
        },
        (error) => {
          console.error('Error al obtener boletas:', error);
        }
      );
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarBoletas();
    }
  }

  generarArrayPaginas(): number[] {
    const paginas: number[] = [];
    const mitadVentana = Math.floor(this.maxPaginasVisibles / 2);

    let inicio = Math.max(this.paginaActual - mitadVentana, 1);
    let fin = inicio + this.maxPaginasVisibles - 1;

    if (fin > this.totalPaginas) {
      fin = this.totalPaginas;
      inicio = Math.max(fin - this.maxPaginasVisibles + 1, 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  aplicarFiltros(filtros: any): void {
    this.filtros = filtros;
    this.paginaActual = 1;
    console.log("Filtros aplicados:", this.filtros);
    this.cargarBoletas();
  }
}
