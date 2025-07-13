import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ModalService } from '../../../../services/modal.service';
import { mozoService } from '../../../../services/mozo.service';


@Component({
  selector: 'app-edit-mozo',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './edit-mozo.component.html',
  styleUrl: './edit-mozo.component.scss'
})
export class EditMozoComponent implements OnInit {

  isOpening = false;
  isHiding = false;
  img: File | null = null;
  cod_moz: string = "";
  name = "";
  email = "";
  password = "";
  comida: any = null;
  listarDetalleMozo: any = null;

  @ViewChild('mozoForm') mozoForm!: NgForm;
  constructor(public modalService: ModalService, private mozoService: mozoService) { }
  ngOnInit(): void {
  this.mozoService.getDatosMozo().subscribe(mozo => {
    if (mozo) {
      this.listarDetalleMozo = mozo;
      this.cod_moz = mozo.cod_moz;
      this.name = mozo.nom_moz;
      this.email = mozo.correo_moz;
      this.password = ""; 
    }
  });
}


  onFileSelected(event: any) {
    this.img = event.target.files[0];
  }

  closeModal(): void {
    this.isHiding = true;
    setTimeout(() => {
      this.isHiding = false;
      this.modalService.hideModal('edit');
      this.eliminarcampos();
    }, 400);
  }

  edit() {
  const procesarEdicion = (base64Img: string | null) => {
    const editMozo = {
      nomMoz: this.name,
      correoMoz: this.email,
      contraMoz: this.password,
      img1Moz: base64Img ?? this.listarDetalleMozo.img1Moz,
    };

    this.mozoService.editarMozo(this.cod_moz, editMozo).subscribe(
      response => {
        alert(" Mozo editado correctamente");
        this.mozoService.emitirRefresh();
        this.closeModal();
      },
      error => {
        alert("❌ Error al editar mozo: " + error.error.message);
      }
    );
  };

  if (this.img) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Img = (reader.result as string).split(',')[1];
      procesarEdicion(base64Img);
    };
    reader.readAsDataURL(this.img);
  } else {
    procesarEdicion(null);
  }
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
