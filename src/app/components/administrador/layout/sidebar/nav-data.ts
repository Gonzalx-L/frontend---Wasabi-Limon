import { ISidebarData } from './helper';

export const navbarData: ISidebarData[] = [
  {
    routerLink: 'inicio',
    icon: 'fa-solid fa-house',
    label: 'Inicio',
  },
  {
    routerLink: 'boletas',
    icon: 'fa-solid fa-file-contract',
    label: 'Boletas',
  },
  {
    routerLink: 'estadisticas',
    icon: 'fa-solid fa-chart-simple',
    label: 'Estadisticas',
    //expanded: true,
    items: [
      {
        routerLink: 'comidaReporte',
        label: 'ComidaReporte',
      },
      {
        routerLink: 'comprobanteReporte',
        label: 'ComprobanteReporte',
      },
      {
        routerLink: 'tipopagoReporte',
        label: 'TipopagoReporte'
      }
    ],
  },
  {
    routerLink: 'ingresos',
    icon: 'fa-solid fa-money-bill',
    label: 'Ingresos',
  },
  {
    routerLink: 'propinas',
    icon: 'fa-solid fa-coins',
    label: 'Propinas',
  },
  {
    routerLink: 'crudMozo',
    icon: 'fa-solid fa-users-gear',
    label: 'CrudMozo',
  },
  {
    routerLink: 'crudComida',
    icon: 'fa-solid fa-utensils',
    label: 'CrudComida',
  },
];

export const navbarDataCuenta=[
  {
    routerLink: 'xx',
    icon: 'fa-solid fa-user-tie',
    label: 'Cuenta',
  }
]