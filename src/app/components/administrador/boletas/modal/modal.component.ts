import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { BoletaService } from '../../../../services/boleta.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

declare var html2pdf: any;


@Component({
  selector: 'app-modal',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})

export class ModalComponent implements OnInit {
  isOpening = false;
  isHiding = false;
  boleta: any = null;
  codOr: string = '';
  codbol: string = '';
  listarDetalleBoleta: any = null;
  listaBoleta: any = null;



  constructor(public modalService: ModalService, public boletaService: BoletaService) { }
  ngOnInit(): void {
    this.modalService.getDatosBoleta().subscribe(boleta => {
      if (boleta) {
        this.boleta = boleta;
        this.codbol = boleta.cod_bol;
        this.codOr = boleta.cod_or;
        this.boletaService.obtenerDetalleBoleta(this.codbol).subscribe(data => {
          this.listaBoleta = data[0];
        })
        this.boletaService.obtenerDetalleComidas(this.codOr).subscribe(data => {
          this.listarDetalleBoleta = data;
          console.log("Detalle comidas: ", this.listarDetalleBoleta);
        });
      }
    });
  }




  closeModal(): void {
    this.isHiding = true;
    setTimeout(() => {
      this.isHiding = false;
      this.modalService.hideModal('modal');
    }, 400);
  }

  imprimir(): void {
    const element = document.getElementById('boleta-content');
    if (!element) return;

    const opt = {
      margin: [-1, 0.3, 0.3, 0.3], 
      filename: `boleta_${this.boleta?.cod_bol || 'reporte'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  }

}
