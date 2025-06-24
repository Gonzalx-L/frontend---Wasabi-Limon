import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { SidebarComponent } from './components/administrador/layout/sidebar/sidebar.component';
import { NavbarComponent } from './components/administrador/layout/navbar/navbar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PlatosComponent } from './components/platos/platos.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '',
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
      { path: 'sidebara', component: SidebarComponent },
      { path: 'navbara', component: NavbarComponent },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
