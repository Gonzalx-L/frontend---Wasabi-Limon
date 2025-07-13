import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtrospropinas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtrospropinas.component.html',
  styleUrls: ['./filtrospropinas.component.scss'],
})
export class FiltrospropinasComponent {
  @Input() filtro: any = {};
  @Input() mozos: { codMoz: string; nomMoz: string }[] = [];
  @Output() filtroChange = new EventEmitter<any>();

  emitirFiltro() {
    // Emitimos el filtro actualizado al padre
    this.filtroChange.emit({ ...this.filtro });
  }
}
