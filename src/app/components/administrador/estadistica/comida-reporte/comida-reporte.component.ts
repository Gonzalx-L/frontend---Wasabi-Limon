import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
  NgModule,
} from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { reportesService } from '../../../../services/reportes.service';
import { SidebarService } from '../../../../services/sidebar.service';
import { FormsModule } from '@angular/forms';
import { FiltroscomrepComponent } from "./filtroscomrep/filtroscomrep.component";

@Component({
  selector: 'app-comida-reporte',
  imports: [CommonModule, FormsModule, FiltroscomrepComponent],
  templateUrl: './comida-reporte.component.html',
  styleUrls: ['./comida-reporte.component.scss'],
})
export class ComidaReporteComponent implements AfterViewInit {
  public chartDay: Chart | undefined;
  public chartMonth: Chart | undefined;
  public chartYear: Chart | undefined;
  year: number = new Date().getFullYear();
  fechSelect: string = '';
  monthSelect: string = '';
  filtros: any = {};

  @ViewChild('chartCanvasGraficoDay') canvasDay!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvasGraficoMonth')
  canvasMonth!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvasGraficoYear')
  canvasYear!: ElementRef<HTMLCanvasElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private reportesService: reportesService,
    private sidebarService: SidebarService
  ) { }

  //Validar el año, no corrigue solo cambia
  valYear() {
    if (this.year < 2000) this.year = 2000;
    if (this.year > 2099) this.year = 2099;
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fecGraf();
      this.monthGraf();
      this.yearGraf();
      this.sidebarService.toggleEvent$.subscribe(() => {
        setTimeout(() => {
          this.redibujarGraficos();
        }, 100);
      });
    }
  }

  //Mandar datos de los inputs a los graficos
  fecGraf() {
    let fecha: Date;
    if (this.fechSelect) {
      fecha = new Date(this.fechSelect);
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1;
      const day = fecha.getDate() + 1;
      console.log(`📆seecionada,  Año: ${year}, Mes: ${month}, Día: ${day}`);
      this.graficoDaY(year, month, day);
    } else {
      fecha = new Date();
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1;
      const day = fecha.getDate();
      console.log(`📆 actual, Año: ${year}, Mes: ${month}, Día: ${day}`);

      this.graficoDaY(year, month, day);
    }
  }

  monthGraf() {
    console.log('🧠 monthGraf() ejecutado con:', this.monthSelect);

    let year: number;
    let month: number;

    if (this.monthSelect) {
      const partes = this.monthSelect.split('-'); // ["2025", "05"]
      year = parseInt(partes[0], 10);
      month = parseInt(partes[1], 10); // ✅ ya es el mes correcto (sin -1)
    } else {
      const fecha = new Date();
      year = fecha.getFullYear();
      month = fecha.getMonth() + 1;
    }

    console.log(`📆 Año: ${year}, Mes: ${month}`);
    this.graficoMonth(year, month);
  }

  yearGraf() {
    console.log("📅 Año seleccionado:", this.year);
    this.valYear(); 
    this.graficoYear(this.year);
  }

  //Graficos
  graficoDaY(year: number, month: number, day: number) {
    const canvas = this.canvasDay.nativeElement;

    // ✅ Destruir gráfico anterior si existe
    if (this.chartDay) {
      this.chartDay.destroy();
    }

    this.reportesService
      .obtenerComidaReporte(year, month, day)
      .subscribe((data) => {
        const labels = data.map((item: any) => item.nom_com);
        const valores = data.map((item: any) => item.cantidad_pedida);

        this.chartDay = new Chart(canvas, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Cantidad Comida',
                data: valores,
                fill: false,
                tension: 0.1,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                ticks: {
                  autoSkip: false,
                  maxRotation: 0,
                  minRotation: 0,
                  padding: 5,
                  callback: function (value: any) {
                    const label = this.getLabelForValue(value);
                    return label.split(' ');
                  },
                  font: {
                    size: 9,
                  },
                },
              },
              y: {
                ticks: {
                  font: {
                    size: 10,
                  },
                },
              },
            },
          },
        });
      });
  }

  graficoMonth(year: number, month: number) {
    const canvas = this.canvasMonth.nativeElement;

    // ✅ Destruir gráfico anterior si existe
    if (this.chartMonth) {
      this.chartMonth.destroy();
    }

    this.reportesService.obtenerComidaReporte(year, month).subscribe((data) => {
      const labels = data.map((item: any) => item.nom_com);
      const valores = data.map((item: any) => item.cantidad_pedida);

      const backgroundColors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#66ff66',
        '#ff6666',
      ];

      this.chartMonth = new Chart(canvas, {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              label: 'Cantidad Comida',
              data: valores,
              backgroundColor: backgroundColors.slice(0, valores.length),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  return `${label}: ${value}`;
                },
              },
            },
          },
        },
      });
    });
  }

  graficoYear(year: number) {
    const canvas = this.canvasYear.nativeElement;

    // ✅ DESTRUIR EL GRÁFICO ANTERIOR
    if (this.chartYear) {
      this.chartYear.destroy();
    }

    this.reportesService.obtenerComidaReporte(year).subscribe((data) => {
      const labels = data.map((item: any) => item.nom_com);
      const valores = data.map((item: any) => item.cantidad_pedida);

      const backgroundColors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#66ff66',
        '#ff6666',
      ];

      this.chartYear = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              label: 'Cantidad Comida',
              data: valores,
              backgroundColor: backgroundColors.slice(0, valores.length),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  return `${label}: ${value}`;
                },
              },
            },
          },
        },
      });
    });
  }

  redibujarGraficos() {
    if (this.chartDay) {
      this.chartDay.destroy();
    }
    if (this.chartMonth) {
      this.chartMonth.destroy();
    }
    if (this.chartYear) {
      this.chartYear.destroy();
    }

    setTimeout(() => {
      this.fecGraf();
      this.monthGraf();
      this.yearGraf();
    }, 300);
  }

  aplicarFiltros(filtros: any): void {
    this.filtros = filtros;
    console.log("Filtros aplicados:", this.filtros);
    //this.cargarBoletas();
  }
}
