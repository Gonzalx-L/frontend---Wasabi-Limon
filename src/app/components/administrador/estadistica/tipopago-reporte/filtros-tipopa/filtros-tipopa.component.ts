import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component, Output, EventEmitter, AfterViewInit, ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
  NgModule,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Chart, ChartType } from 'chart.js/auto';
import { reportesService } from '../../../../../services/reportes.service';
import { SidebarService } from '../../../../../services/sidebar.service';
import { comidaService } from '../../../../../services/comida.service';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-filtros-tipopa',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './filtros-tipopa.component.html',
  styleUrl: './filtros-tipopa.component.scss'
})
export class FiltrosTipopaComponent implements OnInit {

  public chartComparativo: Chart | undefined;
  public graficoListo = false;
  public tipopago: any[] = [];

  @Output() filtrosCambiados = new EventEmitter<any>(); filtroForm: FormGroup;
  @ViewChild('chartCanvasGraficoComparativo') canvasComparativo!: ElementRef<HTMLCanvasElement>;

  constructor(private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private reportesService: reportesService,
    private comidaService: comidaService,
    private sidebarService: SidebarService,
    private cdr: ChangeDetectorRef) {
    this.filtroForm = this.fb.group({
      year: ['']
    });
  }

  ngOnInit(): void {
    this.reportesService.listarTipoPago().subscribe((data) => {
      this.tipopago = data;
    });

    this.sidebarService.toggleEvent$.subscribe(() => {
      setTimeout(() => {
        this.redibujarGraficos();
      }, 100);
    });
  }

  generarGrafico(mostrarAlertas: boolean = true) {
    const year = this.filtroForm.get('year')?.value;

    if (!year) {
      if (mostrarAlertas) {
        alert('Por favor, el año no puede estar vacío');
      }
      return;
    }

    const datasets: any[] = [];
    const colores = ['#FF6384', '#36A2EB', '#4BC0C0', '#9966FF', '#FF9F40'];
    const labelsMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const peticiones = this.tipopago.map((tipopago) => {
      return this.reportesService.obtenerTipoPagoPorMeses(tipopago.cod_tipopago, year).pipe(
        map(data => ({
          nombre: tipopago.nom_tipopago,
          datos: data
        }))
      );
    });

    forkJoin(peticiones).subscribe((resultados: any[]) => {
      resultados.forEach((res, index) => {
        const cantidadesPorMes = Array(12).fill(0);
        res.datos.forEach((item: any) => {
          const mesIndex = item.mes - 1;
          cantidadesPorMes[mesIndex] = item.cantidad_pedida;
        });

        datasets.push({
          label: res.nombre,
          data: cantidadesPorMes,
          borderColor: colores[index % colores.length], // Por si hay más de 5
          fill: false,
          tension: 0.3
        });
      });

      if (this.chartComparativo) {
        this.chartComparativo.destroy();
      }

      const ctx = this.canvasComparativo.nativeElement.getContext('2d');
      if (ctx) {
        this.chartComparativo = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labelsMeses,
            datasets: datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  font: {
                    size: 12
                  }
                }
              },
              title: {
                display: true,
                text: 'Comparativo de Tipos de Pago por mes',
                font: {
                  size: 16
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  callback: function (value, index, ticks) {
                    const label = this.getLabelForValue(value as number);
                    return label.substring(0, 4);
                  },
                  maxRotation: 90,
                  minRotation: 90,
                  font: {
                    size: window.innerWidth < 480 ? 10 : 12
                  }
                }
              },
              y: {
                beginAtZero: true,
                ticks: {
                  font: {
                    size: window.innerWidth < 480 ? 10 : 12
                  }
                }
              }
            }
          }
        });
      }

      this.graficoListo = true;
    });
  }

  redibujarGraficos() {
    if (this.chartComparativo) {
      this.chartComparativo.destroy();
    }

    setTimeout(() => {
      this.generarGrafico(false);
    }, 300);
  }

}
