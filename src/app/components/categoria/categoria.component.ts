import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ necesario para usar [routerLink]

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ agrégalo aquí
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
})
export class CategoriaComponent {
  categorias: string[] = [
    'Entradas',
    'Bebidas',
    'Postres',
    'Sopas',
    'Parrillas',
    'Combos',
    'Ensaladas',
    'Jugos',
    'Extras',
    'Snacks',
  ];
}
