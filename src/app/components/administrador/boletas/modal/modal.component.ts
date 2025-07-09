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
  codBolBuscar: string = '';
  codbol: string = '';
  listarDetalleBoleta: any = null;
  listaBoleta: any = null;
  codOrBuscar: string = '';



  constructor(public modalService: ModalService, public boletaService: BoletaService) { }
  ngOnInit(): void {
    this.escucharCambiosDeBoletaDesdeTabla();
    this.escucharCambiosDeBoletaDesdeBusqueda();
  }

escucharCambiosDeBoletaDesdeTabla(): void {
  this.modalService.getDatosBoleta().subscribe(boleta => {
    if (boleta) {
      this.boleta = boleta;
      this.codbol = boleta.cod_bol;
      this.codOr = boleta.cod_or;

      this.boletaService.obtenerDetalleBoleta(this.codbol).subscribe(data => {
        this.listaBoleta = data[0];
      });

      this.boletaService.obtenerDetalleComidas(this.codOr).subscribe(data => {
        this.listarDetalleBoleta = data;
        console.log("Detalle comidas (tabla):", this.listarDetalleBoleta);
      });
    } else {
      this.listaBoleta = null;
      this.listarDetalleBoleta = [];
    }
  });
}

escucharCambiosDeBoletaDesdeBusqueda(): void {
  this.modalService.getCodBol().subscribe(codBolBuscar => {
    if (codBolBuscar) {
      this.codBolBuscar = codBolBuscar;

      this.boletaService.obtenerDetalleBoleta(this.codBolBuscar).subscribe(data => {
        if (data && data[0]) {
          this.listaBoleta = data[0];
          this.codOrBuscar = this.listaBoleta.cod_or;

          this.boletaService.obtenerDetalleComidas(this.codOrBuscar).subscribe(comidas => {
            this.listarDetalleBoleta = comidas;
            this.boleta = {
              cod_bol: this.listaBoleta.cod_bol,
              fec_bol: this.listaBoleta.fec_bol,
              hora: this.listaBoleta.hora,
              total_bol: this.listaBoleta.total_bol,
              nom_moz: this.listaBoleta.nom_moz
            };
            console.log("Detalle comidas (btnBuscar):", comidas);
          });
        }
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
  const element = document.getElementById('boleta-pdf');
  if (!element) {
    console.error('Elemento #boleta-pdf no encontrado.');
    return;
  }

  // ✅ Mostrar el PDF temporalmente
  element.classList.remove('oculto');

  setTimeout(() => {
    const opt = {
      margin: 0,
      filename: `boleta_${this.boleta?.cod_bol || 'reporte'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
        scrollX: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save().then(() => {
      // ⛔️ Vuelve a ocultarlo después de imprimir
      element.classList.add('oculto');
    });
  }, 300);
}

}
