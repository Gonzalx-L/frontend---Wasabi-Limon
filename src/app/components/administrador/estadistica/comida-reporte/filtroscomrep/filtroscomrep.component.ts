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
  selector: 'app-filtroscomrep',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './filtroscomrep.component.html',
  styleUrl: './filtroscomrep.component.scss'
})
export class FiltroscomrepComponent implements OnInit {

  public chartComparativo: Chart | undefined;
  comidasFiltradas1: any[] = [];
  comidasFiltradas2: any[] = [];
  comidasFiltradas3: any[] = [];
  public graficoListo = false;


  @Output() filtrosCambiados = new EventEmitter<any>(); filtroForm: FormGroup;
  @ViewChild('chartCanvasGraficoComparativo') canvasComparativo!: ElementRef<HTMLCanvasElement>;
  @ViewChild('comida1Input') comida1Input!: ElementRef<HTMLInputElement>;
  @ViewChild('comida2Input') comida2Input!: ElementRef<HTMLInputElement>;
  @ViewChild('comida3Input') comida3Input!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private reportesService: reportesService,
    private comidaService: comidaService,
    private sidebarService: SidebarService,
    private cdr: ChangeDetectorRef) {
    this.filtroForm = this.fb.group({
      comida1: [''],
      codComida1: [''],
      nomComida1: [''],
      comida2: [''],
      codComida2: [''],
      nomComida2: [''],
      comida3: [''],
      codComida3: [''],
      nomComida3: [''],
      year: ['']
    });
  }

  ngOnInit(): void {
    this.filtroForm.get('comida1')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(term => {
        const t = (term || '').trim();
        if (!t) {
          this.comidasFiltradas1 = [];
          this.filtroForm.get('codComida1')?.setValue('', { emitEvent: false }); // 👈 limpiar codCom también sin disparar eventos
          return [];
        }
        return this.comidaService.buscarComidas(t);
      })
    ).subscribe(data => {
      this.comidasFiltradas1 = data;
    });

    this.filtroForm.get('comida2')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(term => {
        const t = (term || '').trim();
        if (!t) {
          this.comidasFiltradas2 = [];
          this.filtroForm.get('codComida2')?.setValue('', { emitEvent: false }); // 👈 limpiar codCom también sin disparar eventos
          return [];
        }
        return this.comidaService.buscarComidas(t);
      })
    ).subscribe(data => {
      this.comidasFiltradas2 = data;
    });

    this.filtroForm.get('comida3')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(term => {
        const t = (term || '').trim();
        if (!t) {
          this.comidasFiltradas3 = [];
          this.filtroForm.get('codComida3')?.setValue('', { emitEvent: false }); // 👈 limpiar codCom también sin disparar eventos
          return [];
        }
        return this.comidaService.buscarComidas(t);
      })
    ).subscribe(data => {
      this.comidasFiltradas3 = data;
    });

    this.sidebarService.toggleEvent$.subscribe(() => {
      setTimeout(() => {
        this.redibujarGraficos();
      }, 100);
    });
  }

  seleccionarComida(comida: any, campoNombre: string, campoCodigo: string) {
    const campoNom = campoCodigo.replace('cod', 'nom'); // ej: codComida1 → nomComida1

    this.filtroForm.get(campoNombre)?.setValue(comida.nomCom, { emitEvent: false });
    this.filtroForm.get(campoCodigo)?.setValue(comida.codCom, { emitEvent: false });
    this.filtroForm.get(campoNom)?.setValue(comida.nomCom, { emitEvent: false }); // 👈 nuevo

    if (campoNombre === 'comida1') {
      this.comidasFiltradas1 = [];
      this.comida1Input.nativeElement.blur();
    } else if (campoNombre === 'comida2') {
      this.comidasFiltradas2 = [];
      this.comida2Input.nativeElement.blur();
    } else if (campoNombre === 'comida3') {
      this.comidasFiltradas3 = [];
      this.comida3Input.nativeElement.blur();
    }

    this.cdr.detectChanges();
  }

  generarGrafico(mostrarAlertas: boolean = true) {
    const codComida1 = this.filtroForm.get('codComida1')?.value;
    const nomComida1 = this.filtroForm.get('nomComida1')?.value;
    const codComida2 = this.filtroForm.get('codComida2')?.value;
    const nomComida2 = this.filtroForm.get('nomComida2')?.value;
    const codComida3 = this.filtroForm.get('codComida3')?.value;
    const nomComida3 = this.filtroForm.get('nomComida3')?.value;
    const year = this.filtroForm.get('year')?.value;

    if (!codComida1 && !codComida2 && !codComida3) {
      if (mostrarAlertas) {
        alert('Debes seleccionar al menos una comida');
      }
      return;
    }

    if (!year) {
      if (mostrarAlertas) {
        alert('Por favor, el año no puede estar vacío');
      }
      return;
    }

    const datasets: any[] = [];
    const colores = ['#FF6384', '#36A2EB', '#4BC0C0']; // Puedes cambiar los colores
    const labelsMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const promesas = [];

    if (codComida1) {
      promesas.push(
        this.reportesService.obtenerComidaPorMeses(codComida1, year).pipe(
          map(data => ({
            nombre: nomComida1,
            datos: data
          }))
        )
      );
    }

    if (codComida2) {
      promesas.push(
        this.reportesService.obtenerComidaPorMeses(codComida2, year).pipe(
          map(data => ({
            nombre: nomComida2,
            datos: data
          }))
        )
      );
    }

    if (codComida3) {
      promesas.push(
        this.reportesService.obtenerComidaPorMeses(codComida3, year).pipe(
          map(data => ({
            nombre: nomComida3,
            datos: data
          }))
        )
      );
    }

    forkJoin(promesas).subscribe((resultados: any[]) => {
      resultados.forEach((res, index) => {
        const cantidadesPorMes = Array(12).fill(0);
        res.datos.forEach((item: any) => {
          const mesIndex = item.mes - 1;
          cantidadesPorMes[mesIndex] = item.cantidad_pedida;
        });

        datasets.push({
          label: res.nombre,
          data: cantidadesPorMes,
          borderColor: colores[index],
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
                    size: 12 // Tamaño de texto de la leyenda
                  }
                }
              },
              title: {
                display: true,
                text: 'Comparativo de comidas por mes',
                font: {
                  size: 16
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  callback: function (value, index, ticks) {
                    // Recorta a 4 caracteres el mes
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
