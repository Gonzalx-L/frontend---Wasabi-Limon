import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MesaService, MesaTemporal } from '../../../services/mesa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.scss'],
})
export class MesasComponent implements OnInit {
  mesas: { [numero: number]: MesaTemporal } = {};
  mozo = '0001'; // Debería venir del login real

  constructor(private mesaService: MesaService, private router: Router) {}

  ngOnInit(): void {
    this.mesaService.getMesas().subscribe({
      next: (data) => (this.mesas = data),
      error: (err) => console.error('Error al obtener mesas', err),
    });
  }

  seleccionarMesa(numero: number) {
    const mesa = this.mesas[numero];
    if (mesa.estado === 'LIBRE') {
      this.mesaService.atenderMesa(numero, this.mozo).subscribe(() => {
        localStorage.setItem('mesaSeleccionada', numero.toString());
        this.router.navigate(['/categoria']);
      });
    }
  }

  colorMesa(estado: string): string {
    if (estado === 'LIBRE') return '#7be77b'; // Verde
    if (estado === 'ATENDIDA') return '#fa6565'; // Rojo
    return '#f5e66c';
  }
}
