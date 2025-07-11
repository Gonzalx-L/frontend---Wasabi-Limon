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
import { debounceTime, switchMap } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

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
  private bloquearBusqueda1 = false;
  private bloquearBusqueda2 = false;
  private bloquearBusqueda3 = false;

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


  generarGrafico() {
    const comida1 = this.filtroForm.get('comida1')?.value;
    const codComida1 = this.filtroForm.get('codComida1')?.value;
    const nomComida1 = this.filtroForm.get('nomComida1')?.value;
    const codComida2 = this.filtroForm.get('codComida2')?.value;
    const nomComida2 = this.filtroForm.get('nomComida2')?.value;
    const codComida3 = this.filtroForm.get('codComida3')?.value;
    const nomComida3 = this.filtroForm.get('nomComida3')?.value;
    const year = this.filtroForm.get('year')?.value;

    if (comida1 == "") {
      alert('Por favor, eligar una comida');
      return;
    }
    if (year == "") {
      alert('Por favor, el año no puede estar   vacio');
      return;
    }
    console.log("Comida 1 => Código:", codComida1, "| Nombre:", nomComida1);
    console.log("Comida 2 => Código:", codComida2, "| Nombre:", nomComida2);
    console.log("Comida 3 => Código:", codComida3, "| Nombre:", nomComida3);

  }
}
