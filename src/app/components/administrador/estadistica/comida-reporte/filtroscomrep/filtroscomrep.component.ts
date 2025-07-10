import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtroscomrep',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filtroscomrep.component.html',
  styleUrl: './filtroscomrep.component.scss'
})
export class FiltroscomrepComponent {

  @Output() filtrosCambiados = new EventEmitter<any>();
  filtroForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filtroForm = this.fb.group({
      codMoz: [''],
      total1: [''],
      total2: [''],
      horaInicio: [''],
      horaFin: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });
  }


  filtrarBoletas() {
    const total1 = this.filtroForm.get('total1')?.value;
    const total2 = this.filtroForm.get('total2')?.value;
    const horaInicio = this.filtroForm.get('horaInicio')?.value;
    const horaFin = this.filtroForm.get('horaFin')?.value;
    const fechaInicio = this.filtroForm.get('fechaInicio')?.value;
    const fechaFin = this.filtroForm.get('fechaFin')?.value;
    if ((total1 && !total2) || (!total1 && total2)) {
      alert('Por favor, completa tanto el Total mínimo como el Total máximo.');
      return;
    }
    if ((horaInicio && !horaFin) || (!horaInicio && horaFin)) {
      alert('Por favor, completa tanto el la hora inicial y la hora final');
      return;
    }
    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
      alert('Por favor, completa tanto la fecha minima y la fecha final');
      return;
    }
    this.filtrosCambiados.emit(this.filtroForm.value);
  }
}
