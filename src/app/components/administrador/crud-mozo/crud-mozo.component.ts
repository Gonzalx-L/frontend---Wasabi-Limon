import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { mozoService } from '../../../services/mozo.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-crud-mozo',
  imports: [CommonModule,],
  templateUrl: './crud-mozo.component.html',
  styleUrls: ['./crud-mozo.component.scss']
})
export class CrudMozoComponent implements OnInit {

  nomMoz: string = "";
  listarMozo: any[] = [];
  totalPaginas: number = 0;
  tamanioPagina: number = 2;
  maxPaginasVisibles: number = 3;
  paginaActual: number = 1;


  constructor(private mozoService: mozoService, private modalService: ModalService) { }
  ngOnInit(): void {
    this.listarPageMozo();
    this.mozoService.mozoRefresh$.subscribe(() => {
      this.listarPageMozo();
    });
  }


  //Modal New
  openModalNew(): void {
    this.modalService.showModal('new');
  }

  //Modal Edit
  openModalEdit(mozo: any): void {
    console.log("datos de mozo enviados a edit:" + mozo);
    this.mozoService.setDatosMozo(mozo);
    this.modalService.showModal('edit');
  }

  //Metodo de Buscar
  buscar(valor: string): void {
    this.nomMoz = valor.trim();
    this.listarPageMozo();
  }

  //Listar Paginas y sus metodos
  listarPageMozo(): void {
    this.mozoService.listarMozoPaginado(this.paginaActual, this.tamanioPagina, this.nomMoz)
      .subscribe(
        (respuesta: any) => {
          this.listarMozo = respuesta.content;
          this.totalPaginas = respuesta.totalPages;
        },
        (error) => {
          console.error('Error al obtener boletas:', error);
        }
      );
  }

  eliminarMozo(mozo: any) {
    const codMoz = mozo.cod_moz;
    const nomMoz = mozo.nom_moz;
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este mozo: " + nomMoz + "?");

    if (!confirmacion) {
      return;
    }

    console.log("codMoz: " + codMoz);
    this.mozoService.eliminarMozo(codMoz)
      .subscribe(
        response => {
          alert("Mozo eliminado exitosamente.");
          this.mozoService.emitirRefresh();
        },
        error => {
          console.error('Error al ELIMINAR', error);
          const errorMessage = error.error.message || "No se pudo eliminar el mozo.";
          alert("ERROR: " + errorMessage);
        }
      );
  }


  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.listarPageMozo();
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

}
