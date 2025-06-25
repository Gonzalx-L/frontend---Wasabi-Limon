import { animate, keyframes, state, style, transition, trigger } from "@angular/animations";

export interface ISidebarData {
    routerLink: string;
    icon?: string;
    label: string;
    expanded?: boolean;
    items?: ISidebarData[];
}

//  ANIMACIONES 
//Desvanecer el texto
export const fadeInOut = trigger('fadeInOut', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 }))
    ]),
    transition(':leave', [
        style({ opacity: 1 }),
        animate('150ms', style({ opacity: 0 }))
    ])
])
//Rotar el icono
export const rotate = trigger('rotate', [
    transition(':enter', [
        style({ transform: 'rotate(0deg)', opacity: 0 }),
        animate(
            '400ms ease-out',
            keyframes([
                style({ transform: 'rotate(0deg)', opacity: 0.5, offset: 0.5 }),
                style({ transform: 'rotate(360deg)', opacity: 1, offset: 1 }),
            ])
        )
    ])
])
//Aparecer el submenu
export const submenu = trigger('submenu', [
    state('hidden', style({
        height: '0',
        overflow: 'hidden'
    })),
    state('visible', style({
        height: '*'
    })),
    transition('visible <=> hidden', [style({ overflow: 'hidden' }),
    animate('{{transitionParams}}')]),
    transition('void => *', animate(0))
])