import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ModalService } from '../../../../services/modal.service';
import { mozoService } from '../../../../services/mozo.service';
import { comidaService } from '../../../../services/comida.service';

@Component({
  selector: 'app-edit-comida',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './edit-comida.component.html',
  styleUrl: './edit-comida.component.scss'
})
export class EditComidaComponent implements OnInit {

  isOpening = false;
  isHiding = false;
  cod_com: string = "";
  name = "";
  price = "";
  dec = "";
  codcate = "";
  comida: any = null;
  listarDetalleMozo: any = null;

  @ViewChild('comidaForm') comidaForm!: NgForm;
  constructor(public modalService: ModalService, private mozoService: mozoService, private comidaService: comidaService) { }

  ngOnInit(): void {
    this.comidaService.getDatosComida().subscribe(comida => {
      if (comida) {
        this.listarDetalleMozo = comida;
        this.cod_com = comida.codCom;
        this.name = comida.nomCom;
        this.price = comida.precNom;
        this.dec = comida.descCom;
      }
    });
  }

  closeModal(): void {
    this.isHiding = true;
    setTimeout(() => {
      this.isHiding = false;
      this.modalService.hideModal('editCom');
      this.eliminarcampos();
    }, 400);
  }

  edit() {
    const comidaActualizada = {
      nomCom: this.name,
      precNom: this.price,
      descCom: this.dec,
      categorias: [
        { cod_cat: this.codcate }
      ]
    };

    this.comidaService.editarComida(this.cod_com, comidaActualizada).subscribe(
      response => {
        alert("Comida actualizada correctamente");
        this.mozoService.emitirRefresh();
        this.closeModal();
      },
      error => {
        alert("Error al actualizar comida: " + error.error?.error || "Error desconocido");
      }
    );
  }


  eliminarcampos() {
    this.name = "";
    this.price = "";
    this.dec = "";
    this.codcate = "";

    if (this.comidaForm) {
      this.comidaForm.resetForm();
    }
  }

}
