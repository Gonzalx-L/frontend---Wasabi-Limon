import { AfterViewInit, Component, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, ChartType } from 'chart.js/auto';
import { reportesService } from '../../../services/reportes.service';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements AfterViewInit {
  public chartPlatos: Chart | undefined;
  public chartPropina: Chart | undefined;
  public totalBoletasHoy: number = 0;
  public totalIngresosHoy: number = 0.0;

  @ViewChild('chartCanvasPlatos') canvasPlatos!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvasPropinas') canvasPropina!: ElementRef<HTMLCanvasElement>;


  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private reportesService: reportesService
  ) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.graficoPlatos();
      this.graficoPropina();
      this.obtenerNroBoletas();
      this.obtenerIngresosHoy();
    }
  }

  obtenerNroBoletas() {
    const hoy = new Date();
    const fecha = hoy.toISOString().split('T')[0]; // formato: yyyy-MM-dd
    this.reportesService.contarBoletasPorFecha("2025-05-22").subscribe((cantidad) => {
      this.totalBoletasHoy = cantidad;
      console.log('Total de boletas:', cantidad);
    });
  }

  obtenerIngresosHoy() {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = hoy.getMonth() + 1; //empieza desde 0
    const day = hoy.getDate();

    this.reportesService.ObtenerIngresosReporteFiltro(2025, 5, 22).subscribe((respuesta) => {
      if (respuesta && respuesta.length > 0) {
        this.totalIngresosHoy = respuesta[0].ingreso;
        console.log('✅ Ingresos de hoy:', this.totalIngresosHoy);
      } else {
        console.warn('⚠️ No se encontraron ingresos para hoy');
        this.totalIngresosHoy = 0;
      }
    });
  }

  //Metodos para los graficos
  graficoPlatos() {
    const canvas = this.canvasPlatos.nativeElement;

    const data = {
      labels: [
        'Arroz con Pollo',
        'Ceviche',
        'Arroz c/n Marizcos',
        'Parihuela',
        'Milanesa de Pollo'
      ],
      datasets: [
        {
          label: 'Ingresos',
          data: [12, 32, 20, 21, 4],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)'
          ],
          borderWidth: 1
        }
      ]
    };

    this.chartPlatos = new Chart(canvas, {
      type: 'bar' as ChartType,
      data
    });

    console.log('✅ Gráfico platos creado');
  }
  graficoPropina() {
    const canvas = this.canvasPropina.nativeElement;

    const data = {
      labels: [
        'Mozo1',
        'Mozo2',
        'Mozo3'
      ],
      datasets: [
        {
          label: 'Propinas',
          data: [12, 32, 20],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
          ],
          borderWidth: 1
        }
      ]
    };

    this.chartPropina = new Chart(canvas, {
      type: 'bar' as ChartType,
      data
    });

    console.log('✅ Gráfico comida creado');
  }
}
