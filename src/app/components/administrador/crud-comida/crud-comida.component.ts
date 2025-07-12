import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { comidaService } from '../../../services/comida.service';
import { ModalService } from '../../../services/modal.service';
import { mozoService } from '../../../services/mozo.service';

@Component({
  selector: 'app-crud-comida',
  imports: [CommonModule],
  templateUrl: './crud-comida.component.html',
  styleUrl: './crud-comida.component.scss'
})
export class CrudComidaComponent implements OnInit {

  nomCom: string = "";
  listarComida: any[] = [];
  totalPaginas: number = 0;
  tamanioPagina: number = 5;
  maxPaginasVisibles: number = 3;
  paginaActual: number = 1;

  constructor(private comidaService: comidaService, 
              private modalService: ModalService,
              private mozoService: mozoService
  ) { } 

  ngOnInit(): void {
    this.listarPageComida();
    this.mozoService.mozoRefresh$.subscribe(() => {
      this.listarPageComida();
    });
  }

  openModalNew(): void {
    this.modalService.showModal('newCom');
  }

  //Modal Edit
  openModalEdit(comida: any): void {
    console.log("datos de comida enviados a edit:" + comida);
    this.comidaService.setDatosComida(comida);
    this.modalService.showModal('editCom');
  }

  //Metodo de Buscar
  buscar(valor: string): void {
    this.nomCom = valor.trim();
    this.listarPageComida();
  }

  //Listar Paginas y sus metodos
  listarPageComida(): void {
    this.comidaService.listarComidaPaginado(this.paginaActual, this.tamanioPagina, this.nomCom)
      .subscribe(
        (respuesta: any) => {
          this.listarComida = respuesta.content;
          this.totalPaginas = respuesta.totalPages;
        },
        (error) => {
          console.error('Error al obtener boletas:', error);
        }
      );
  }

  eliminarMozo(comida: any) {
    const codCom = comida.codCom;
    const nomCom = comida.nomCom;
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta comida: '" + nomCom + "'?");

    if (!confirmacion) {
      return;
    }

    console.log("codCom: " + codCom);
    this.comidaService.eliminarComida(codCom)
      .subscribe(
        response => {
          alert("Comida eliminado exitosamente.");
          this.mozoService.emitirRefresh();
        },
        error => {
          console.error('Comida al ELIMINAR', error);
          const errorMessage = error.error.message || "No se pudo eliminar el mozo.";
          alert("ERROR: " + errorMessage);
        }
      );
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.listarPageComida();
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
