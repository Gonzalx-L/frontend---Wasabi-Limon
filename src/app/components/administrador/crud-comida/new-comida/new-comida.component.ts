import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ModalService } from '../../../../services/modal.service';
import { mozoService } from '../../../../services/mozo.service';
import { comidaService } from '../../../../services/comida.service';


@Component({
  selector: 'app-new-comida',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './new-comida.component.html',
  styleUrl: './new-comida.component.scss'
})
export class NewComidaComponent {

  isOpening = false;
  isHiding = false;
  name = "";
  price = "";
  dec = "";
  codcate = "";
  nomcate = "";


  @ViewChild('comForm') comForm!: NgForm;
  constructor(public modalService: ModalService, private mozoService: mozoService, private comidaService: comidaService) { }

  closeModal(): void {
    this.isHiding = true;
    setTimeout(() => {
      this.isHiding = false;
      this.modalService.hideModal('newCom');
      this.eliminarcampos();
      this.mozoService.emitirRefresh();
    }, 400);
  }

  agregar() {
    if (!this.name || !this.price || !this.dec || !this.codcate) {
      alert("Por favor, llene todos los campos.");
      return;
    }
    const nuevaComida = {
      nomCom: this.name,
      precNom: this.price,
      descCom: this.dec,
      cod_cat: this.codcate
    };
    this.comidaService.agregarComida(nuevaComida).subscribe(
      response => {
        console.log("Registro exitoso", response);
        alert("Comida REGISTRADO EXITOSAMENTE");
        this.eliminarcampos();
      },
      error => {
        console.error('Error de registro Comida', error);
        alert("ERROR: " + error.message);
      }
    );


  }

  eliminarcampos() {
    this.name = "";
    this.price = "";
    this.dec = "";
    this.codcate="";

    if (this.comForm) {
      this.comForm.resetForm();
    }
  }

}
