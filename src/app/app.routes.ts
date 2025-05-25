import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { BarraizqComponent } from './components/administrador/barraizq/barraizq.component';
import { DnnComponent } from './components/administrador/dnn/dnn.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, 
  { path: 'categoria', component: CategoriaComponent }, 
  {path: 'admi',
    children: [
      {path: 'barraizq', component: BarraizqComponent},
      {path: 'dnn', component: DnnComponent},
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
