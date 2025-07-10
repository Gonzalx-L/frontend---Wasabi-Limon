import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../services/categoria.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-platos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './platos.component.html',
  styleUrls: ['./platos.component.scss'],
})
export class PlatosComponent implements OnInit {
  codCategoria: string = '';
  categoriaNombre: string = '';
  platos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private categoriaService: CategoriaService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.codCategoria = params.get('codCat')!;

      this.categoriaService.listarNombres().subscribe({
        next: (categorias) => {
          const cat = categorias.find((c) => c.cod_cat === this.codCategoria);
          this.categoriaNombre = cat ? cat.nombre : 'Categoría desconocida';
        },
        error: (err) => {
          console.error('Error al obtener nombres de categoría', err);
          this.categoriaNombre = 'Error';
        },
      });

      this.categoriaService
        .listarPlatosPorCategoria(this.codCategoria)
        .subscribe({
          next: (data) => {
            this.platos = data;
          },
          error: (err) => console.error('Error al obtener platos', err),
        });
    });
  }
  agregarAlCarrito(plato: any): void {
    this.cartService.add(plato.codCom).subscribe(() => {});
  }
  quitarDelCarrito(plato: any): void {
    this.cartService.remove(plato.codCom).subscribe(() => {});
  }
}
