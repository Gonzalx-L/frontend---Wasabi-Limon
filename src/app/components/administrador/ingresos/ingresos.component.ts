import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngresosService } from '../../../services/ingresos.service';
import { FiltrosingresosComponent } from './filtrosingresos/filtrosingresos.component';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltrosingresosComponent],
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.scss'],
})
export class IngresosComponent implements OnInit {
  filtro = { year: '', month: '', day: '' };
  ingresos: any[] = [];
  fechaSeleccionada: string = '';
  mesSeleccionado: string = '';
  anioSeleccionado: number = new Date().getFullYear();

  @ViewChild('graficoDia') graficoDiaRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoMes') graficoMesRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoAnio') graficoAnioRef!: ElementRef<HTMLCanvasElement>;

  chartDia?: Chart;
  chartMes?: Chart;
  chartAnio?: Chart;

  constructor(private ingresosService: IngresosService) {}

  ngOnInit() {
    this.buscarIngresos();
    this.cargarGraficoUltimosDias();
    this.cargarGraficoUltimosMeses();
    this.cargarGraficoPorAnios();
  }

  onFiltroChange(nuevoFiltro: any) {
    this.filtro = nuevoFiltro;
    this.buscarIngresos();
    this.cargarGraficoUltimosDias();
    this.cargarGraficoUltimosMeses();
    this.cargarGraficoPorAnios();
  }

  buscarIngresos() {
    this.ingresosService.getIngresos(this.filtro).subscribe((data) => {
      this.ingresos = data;
    });
  }

  // Gráfico de los últimos 15 días
  cargarGraficoUltimosDias() {
    const hoy = new Date();
    const labels: string[] = [];
    const valores: number[] = [];

    // Creamos un array de promesas (una por día)
    const requests = [];
    for (let i = 14; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1;
      const day = fecha.getDate();
      const label = `${fecha.getDate()}/${fecha.getMonth() + 1}`;
      labels.push(label);
      requests.push(
        this.ingresosService.getIngresos({ year, month, day }).toPromise()
      );
    }

    Promise.all(requests).then((resultados) => {
      resultados.forEach((data: any, idx) => {
        // Suma total del día (puedes ajustar para mostrar por tipo)
        const total = data.reduce(
          (acc: number, curr: any) => acc + (curr.veces_usado || 0),
          0
        );
        valores[idx] = total;
      });
      if (this.chartDia) this.chartDia.destroy();
      this.chartDia = new Chart(this.graficoDiaRef.nativeElement, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Ingresos (últimos 15 días)',
              data: valores,
              borderColor: '#699dfa',
              backgroundColor: 'rgba(105,157,250,0.15)',
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: { responsive: true },
      });
    });
  }

  // Gráfico de los últimos 5 meses
  cargarGraficoUltimosMeses() {
    const hoy = new Date();
    const labels: string[] = [];
    const valores: number[] = [];

    const requests = [];
    for (let i = 4; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setMonth(hoy.getMonth() - i);
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1;
      const label = `${month}/${year}`;
      labels.push(label);
      requests.push(
        this.ingresosService.getIngresos({ year, month }).toPromise()
      );
    }

    Promise.all(requests).then((resultados) => {
      resultados.forEach((data: any, idx) => {
        const total = data.reduce(
          (acc: number, curr: any) => acc + (curr.veces_usado || 0),
          0
        );
        valores[idx] = total;
      });
      if (this.chartMes) this.chartMes.destroy();
      this.chartMes = new Chart(this.graficoMesRef.nativeElement, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Ingresos (últimos 5 meses)',
              data: valores,
              backgroundColor: '#394b54',
            },
          ],
        },
        options: { responsive: true },
      });
    });
  }

  // Gráfico por años (ejemplo: los últimos 3 años)
  cargarGraficoPorAnios() {
    const hoy = new Date();
    const labels: string[] = [];
    const valores: number[] = [];

    const requests = [];
    for (let i = 2; i >= 0; i--) {
      const year = hoy.getFullYear() - i;
      labels.push(`${year}`);
      requests.push(this.ingresosService.getIngresos({ year }).toPromise());
    }

    Promise.all(requests).then((resultados) => {
      resultados.forEach((data: any, idx) => {
        const total = data.reduce(
          (acc: number, curr: any) => acc + (curr.veces_usado || 0),
          0
        );
        valores[idx] = total;
      });
      if (this.chartAnio) this.chartAnio.destroy();
      this.chartAnio = new Chart(this.graficoAnioRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              label: 'Ingresos por año',
              data: valores,
              backgroundColor: ['#699dfa', '#394b54', '#FF6384'],
            },
          ],
        },
        options: { responsive: true },
      });
    });
  }
}
