import { Routes } from '@angular/router';
import { LoginComponent } from './components/mozos/login/login.component';
import { CategoriaComponent } from './components/mozos/categoria/categoria.component';
import { SidebarComponent } from './components/administrador/layout/sidebar/sidebar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PlatosComponent } from './components/mozos/platos/platos.component';
import { InicioComponent } from './components/administrador/inicio/inicio.component';
import { BoletasComponent } from './components/administrador/boletas/boletas.component';
import { ComponentComponent } from './components/administrador/component/component.component';
import { IngresosComponent } from './components/administrador/ingresos/ingresos.component';
import { PropinasComponent } from './components/administrador/propinas/propinas.component';
import { CrudMozoComponent } from './components/administrador/crud-mozo/crud-mozo.component';
import { CrudComidaComponent } from './components/administrador/crud-comida/crud-comida.component';
import { ComidaReporteComponent } from './components/administrador/estadistica/comida-reporte/comida-reporte.component';
import { ComprobanteReporteComponent } from './components/administrador/estadistica/comprobante-reporte/comprobante-reporte.component';
import { TipopagoReporteComponent } from './components/administrador/estadistica/tipopago-reporte/tipopago-reporte.component';
import { MesasComponent } from './components/mozos/mesas/mesas.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'mesas', component: MesasComponent },
      { path: 'categoria', component: CategoriaComponent },
      { path: 'categoria/:codCat/platos', component: PlatosComponent },
    ],
  },

  //PARTE DE ANTONY
  {
    path: 'admi',
    component: ComponentComponent,
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'boletas', component: BoletasComponent },
      { path: 'comidaReporte', component: ComidaReporteComponent },
      { path: 'comprobanteReporte', component: ComprobanteReporteComponent },
      { path: 'tipopagoReporte', component: TipopagoReporteComponent },
      { path: 'ingresos', component: IngresosComponent },
      { path: 'propinas', component: PropinasComponent },
      { path: 'crudMozo', component: CrudMozoComponent },
      { path: 'crudComida', component: CrudComidaComponent },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    ],
  },
];
