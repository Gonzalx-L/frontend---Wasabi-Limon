import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ModalService } from '../../../../services/modal.service';
import { mozoService } from '../../../../services/mozo.service';


@Component({
  selector: 'app-new-mozo',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './new-mozo.component.html',
  styleUrl: './new-mozo.component.scss'
})
export class NewMozoComponent {

  isOpening = false;
  isHiding = false;
  img: File | null = null;
  name = "";
  email = "";
  password = "";

  @ViewChild('mozoForm') mozoForm!: NgForm;
  constructor(public modalService: ModalService, private mozoService: mozoService) { }

  closeModal(): void {
    this.isHiding = true;
    setTimeout(() => {
      this.isHiding = false;
      this.modalService.hideModal('new');
      this.eliminarcampos(); // ✅ aquí también
      this.mozoService.emitirRefresh();
    }, 400);
  }

  onFileSelected(event: any) {
    this.img = event.target.files[0];
  }

  agregar() {
    if (!this.name || !this.email || !this.password || !this.img) {
      alert("Por favor, llene todos los campos.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Img = (reader.result as string).split(',')[1]; // quitar el encabezado
      const nuevoMozo = {
        nomMoz: this.name,
        correoMoz: this.email,
        contraMoz: this.password,
        img1Moz: base64Img,
        cod_adm: "1010"
      };

      this.mozoService.agregarMozo(nuevoMozo).subscribe(
        response => {
          console.log("Registro exitoso", response);
          alert("Mozo REGISTRADO EXITOSAMENTE");
          this.eliminarcampos();
        },
        error => {
          console.error('Error de registro MOZO', error);
          alert("ERROR: " + error.message);
        }
      );
    };

    reader.readAsDataURL(this.img);
  }

  eliminarcampos() {
    this.name = "";
    this.email = "";
    this.password = "";
    this.img = null;

    const inputFile = document.getElementById('inputGroupFile01') as HTMLInputElement;
    if (inputFile) inputFile.value = "";

    if (this.mozoForm) {
      this.mozoForm.resetForm(); // ✅ esto borra también el estado touched/dity
    }
  }


}
