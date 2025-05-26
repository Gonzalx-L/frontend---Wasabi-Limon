import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-platos',
  standalone: true,
  imports: [],
  templateUrl: './platos.component.html',
  styleUrls: ['./platos.component.scss'],
})
export class PlatosComponent implements OnInit {
  codCat: string = '';
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.codCat = this.route.snapshot.paramMap.get('codCat')!;
    // Aquí podrías llamar a un servicio: this.platoService.getPorCategoria(this.codCat)
  }
}
