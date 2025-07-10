import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component, Output, EventEmitter, AfterViewInit, ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
  NgModule,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Chart, ChartType } from 'chart.js/auto';
import { reportesService } from '../../../../../services/reportes.service';
import { SidebarService } from '../../../../../services/sidebar.service';

@Component({
  selector: 'app-filtroscomrep',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './filtroscomrep.component.html',
  styleUrl: './filtroscomrep.component.scss'
})
export class FiltroscomrepComponent {

  public chartComparativo: Chart | undefined;

  @Output() filtrosCambiados = new EventEmitter<any>();
  filtroForm: FormGroup;
  @ViewChild('chartCanvasGraficoComparativo') canvasComparativo!: ElementRef<HTMLCanvasElement>;

  constructor(private fb: FormBuilder, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private reportesService: reportesService,
    private sidebarService: SidebarService) {
    this.filtroForm = this.fb.group({
      comida1: [''],
      comida2: [''],
      comida3: [''],
      year: ['']
    });
  }


  filtrarBoletas() {
    const comida1 = this.filtroForm.get('comida1')?.value;
    const comida2 = this.filtroForm.get('comida2')?.value;
    const comida3 = this.filtroForm.get('comida3')?.value;
    const year = this.filtroForm.get('year')?.value;
    if (comida1 == "") {
      alert('Por favor, eligar una comida');
      return;
    }
    if (year == "") {
      alert('Por favor, el año no puede estar vacio');
      return;
    }
  }
}
