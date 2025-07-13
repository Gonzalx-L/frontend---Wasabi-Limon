import { AfterViewInit, Component, ElementRef, ViewChild, Inject, PLATFORM_ID,}from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, ChartType } from 'chart.js/auto';
import { reportesService } from '../../../services/reportes.service';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements AfterViewInit {
  public chartPlatos: Chart | undefined;
  public chartPropina: Chart | undefined;
  public totalBoletasHoy: number = 0;
  public totalIngresosHoy: number = 0.0;

  @ViewChild('chartCanvasPlatos') canvasPlatos!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvasPropinas') canvasPropina!: ElementRef<HTMLCanvasElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private reportesService: reportesService,
    private sidebarService: SidebarService
  ) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.graficoPlatos();
      this.graficoPropina();
      this.obtenerNroBoletas();
      this.obtenerIngresosHoy();
      this.sidebarService.toggleEvent$.subscribe(() => {
        setTimeout(() => {
          this.redibujarGraficos();
        }, 100);
      });
    }
  }

  obtenerNroBoletas() {
    const hoy = new Date();
    const fecha = hoy.toISOString().split('T')[0]; // formato: yyyy-MM-dd
    this.reportesService
      .contarBoletasPorFecha(fecha).subscribe((cantidad) => {
        this.totalBoletasHoy = cantidad;
        console.log('Total de boletas:', cantidad);
      });
  }

  obtenerIngresosHoy() {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = hoy.getMonth() + 1; //empieza desde 0
    const day = hoy.getDate();

    this.reportesService
      .ObtenerIngresosReporteFiltro(year, month, day).subscribe((respuesta) => {
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
  private generateColors(length: number): { backgroundColors: string[], borderColors: string[] } {
    const backgroundColors: string[] = [];
    const borderColors: string[] = [];

    for (let i = 0; i < length; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);

      backgroundColors.push(`rgba(${r}, ${g}, ${b}, 0.2)`);
      borderColors.push(`rgba(${r}, ${g}, ${b}, 1)`);
    }

    return { backgroundColors, borderColors };
  }

  graficoPlatos() {
    const canvas = this.canvasPlatos.nativeElement;

    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = hoy.getMonth() + 1;
    const day = hoy.getDate();

    this.reportesService.obtenerComidaReporte(year, month, day).subscribe((data) => {
      // Extraer nombres y cantidades
      const labels = data.map((item: any) => item.nom_com);
      const valores = data.map((item: any) => item.cantidad_pedida);
      const { backgroundColors, borderColors } = this.generateColors(valores.length);
      // Crear gráfico
      this.chartPlatos = new Chart(canvas, {
        type: 'bar' as ChartType,
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Cantidad Pedida',
              data: valores,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
        }
      });
      console.log('✅ Gráfico de platos actualizado');
    });
  }

  graficoPropina() {
    const canvas = this.canvasPropina.nativeElement;

    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = hoy.getMonth() + 1;
    const day = hoy.getDate();


    this.reportesService.ObtenerPropinaReporteFiltro(year, month, day).subscribe((data) => {
      // Extraer nombres y cantidades
      const labels = data.map((item: any) => item.nom_moz);
      const valores = data.map((item: any) => item.propina);

      const { backgroundColors, borderColors } = this.generateColors(valores.length);

      // Crear gráfico
      this.chartPropina = new Chart(canvas, {
        type: 'bar' as ChartType,
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Propina por Mozo',
              data: valores,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });
      console.log('✅ Gráfico comida creado');
    });

  }

  redibujarGraficos() {
    if (this.chartPlatos) {
      this.chartPlatos.destroy();
    }
    if (this.chartPropina) {
      this.chartPropina.destroy();
    }

    setTimeout(() => {
      this.graficoPlatos();
      this.graficoPropina();
    }, 300);
  }
}
