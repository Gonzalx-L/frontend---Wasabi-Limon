import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtrosingresos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtrosingresos.component.html',
  styleUrls: ['./filtrosingresos.component.scss'],
})
export class FiltrosingresosComponent {
  @Input() filtro: any = {};
  @Output() filtroChange = new EventEmitter<any>();

  emitirFiltro() {
    this.filtroChange.emit({ ...this.filtro });
  }
}
