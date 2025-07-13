import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropinasService } from '../../../services/propinas.service';
import { mozoService } from '../../../services/mozo.service';
import { FiltrospropinasComponent } from '../propinas/filtrospropinas/filtrospropinas/filtrospropinas.component';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-propina',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltrospropinasComponent],
  templateUrl: './propina.component.html',
  styleUrls: ['./propina.component.scss'],
})
export class PropinaComponent implements OnInit {
  filtro = { codMoz: '', year: '', month: '', day: '' };
  propinas: any[] = [];
  mozos: { codMoz: string; nomMoz: string }[] = [];

  @ViewChild('graficoDia') graficoDiaRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoMes') graficoMesRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoAnio') graficoAnioRef!: ElementRef<HTMLCanvasElement>;

  chartDia?: Chart;
  chartMes?: Chart;
  chartAnio?: Chart;

  constructor(
    private propinasService: PropinasService,
    public mozoService: mozoService
  ) {}

  ngOnInit() {
    // Carga mozos dinámicamente
    this.mozoService.getMozos().subscribe((data) => {
      this.mozos = data.map((item) => ({
        codMoz: item.cod_moz,
        nomMoz: item.nom_moz,
      }));
    });

    this.buscarPropinas();
    this.actualizarGraficos();
  }

  onFiltroChange(nuevoFiltro: any) {
    this.filtro = { ...nuevoFiltro };
    this.buscarPropinas();
    this.actualizarGraficos();
  }

  buscarPropinas() {
    this.propinasService.getPropinas(this.filtro).subscribe((data) => {
      this.propinas = data;
    });
  }

  // Actualiza todos los gráficos con el filtro global
  actualizarGraficos() {
    this.actualizarGraficoDia();
    this.actualizarGraficoMes();
    this.actualizarGraficoAnio();
  }

  actualizarGraficoDia() {
    const year = +this.filtro.year || new Date().getFullYear();
    const month = +this.filtro.month || new Date().getMonth() + 1;
    const day = +this.filtro.day || new Date().getDate();
    this.obtenerPropinasPorDia(year, month, day);
  }

  actualizarGraficoMes() {
    const year = +this.filtro.year || new Date().getFullYear();
    const month = +this.filtro.month || new Date().getMonth() + 1;
    this.obtenerPropinasPorMes(year, month);
  }

  actualizarGraficoAnio() {
    const year = +this.filtro.year || new Date().getFullYear();
    this.obtenerPropinasPorAnio(year);
  }

  obtenerPropinasPorDia(year: number, month: number, day: number) {
    this.propinasService
      .getPropinas({ ...this.filtro, year, month, day })
      .subscribe((data) => {
        const labels = data.map((item: any) => item.nom_moz);
        const valores = data.map((item: any) => item.propina);
        if (this.chartDia) this.chartDia.destroy();
        this.chartDia = new Chart(this.graficoDiaRef.nativeElement, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Propinas (S/)',
                data: valores,
                backgroundColor: '#699dfa',
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
          },
        });
      });
  }

  obtenerPropinasPorMes(year: number, month: number) {
    this.propinasService
      .getPropinas({ ...this.filtro, year, month })
      .subscribe((data) => {
        const labels = data.map((item: any) => item.nom_moz);
        const valores = data.map((item: any) => item.propina);
        if (this.chartMes) this.chartMes.destroy();
        this.chartMes = new Chart(this.graficoMesRef.nativeElement, {
          type: 'pie',
          data: {
            labels,
            datasets: [{ label: 'Propinas (S/)', data: valores }],
          },
          options: { responsive: true },
        });
      });
  }

  obtenerPropinasPorAnio(year: number) {
    this.propinasService
      .getPropinas({ ...this.filtro, year })
      .subscribe((data) => {
        const labels = data.map((item: any) => item.nom_moz);
        const valores = data.map((item: any) => item.propina);
        if (this.chartAnio) this.chartAnio.destroy();
        this.chartAnio = new Chart(this.graficoAnioRef.nativeElement, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [{ label: 'Propinas (S/)', data: valores }],
          },
          options: { responsive: true },
        });
      });
  }
}
