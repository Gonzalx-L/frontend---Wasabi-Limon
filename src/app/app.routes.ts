import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { BarraizqComponent } from './components/administrador/barraizq/barraizq.component';
import { DnnComponent } from './components/administrador/dnn/dnn.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PlatosComponent } from './components/platos/platos.component';

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
  {
    path: 'admi',
    children: [
      { path: 'barraizq', component: BarraizqComponent },
      { path: 'dnn', component: DnnComponent },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
