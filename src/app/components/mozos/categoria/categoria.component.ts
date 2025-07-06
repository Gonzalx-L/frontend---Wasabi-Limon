import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
})
export class CategoriaComponent implements OnInit {
  categorias: any[] = [];

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.categoriaService.listarNombres().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al obtener categorías', err),
    });
  }
}
