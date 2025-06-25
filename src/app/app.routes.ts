import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { SidebarComponent } from './components/administrador/layout/sidebar/sidebar.component';
import { NavbarComponent } from './components/administrador/layout/navbar/navbar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PlatosComponent } from './components/platos/platos.component';
import { InicioComponent } from './components/administrador/inicio/inicio.component';
import { BoletasComponent } from './components/administrador/boletas/boletas.component';
import { EstadisticasComponent } from './components/administrador/estadisticas/estadisticas.component';
import { ComponentComponent } from './components/administrador/component/component.component';
import { IngresosComponent } from './components/administrador/ingresos/ingresos.component';
import { PropinasComponent } from './components/administrador/propinas/propinas.component';
import { CrudMozoComponent } from './components/administrador/crud-mozo/crud-mozo.component';
import { CrudComidaComponent } from './components/administrador/crud-comida/crud-comida.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'categoria', component: CategoriaComponent },
      { path: 'categoria/:codCat/platos', component: PlatosComponent },

    ],
  },
  // {
  //   path: 'categoria',
  //   component: LayoutComponent,
  //   children: [{ path: '', component: CategoriaComponent }],
  // },
  // {
  //   path: 'categoria/:codCat/platos',
  //   component: LayoutComponent,
  //   children: [{ path: '', component: PlatosComponent }],
  // },

  //PARTE DE ANTONY
  {
    path: 'admi',
    component: ComponentComponent,
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'boletas', component: BoletasComponent },
      { path: 'estadisticas', component: EstadisticasComponent },
      { path: 'ingresos', component: IngresosComponent },
      { path: 'propinas', component: PropinasComponent },
      { path: 'crudMozo', component: CrudMozoComponent },
      { path: 'crudComida', component: CrudComidaComponent },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  },
];
