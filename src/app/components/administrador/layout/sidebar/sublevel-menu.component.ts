import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeInOut, ISidebarData, submenu } from './helper';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sublevel-menu',
  imports: [CommonModule, RouterModule],
  template: `
    <ul *ngIf="collapsed && data.items && data.items.length > 0"
        [@submenu]="expanded 
          ? {value: 'visible', 
            params:{transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '*'}} 
          : {value:'hidden',
            params:{transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '0'}}"
          
        class="sublevel-sidebar"
    >
      <li *ngFor="let item of data.items" class="sublevel-sidebar-item">
          <a class="sublevel-sidebar-link"
            (click)="handleClick(item)"
            *ngIf="item.items && item.items.length > 0"
          >
            <i class="sublevel-link-icon fa fa-circle"></i>
            <span class="sublevel-link-text" [@fadeInOut] *ngIf="collapsed">{{item.label}}</span>
            <i *ngIf="item.items && collapsed" class="menu-collapse-icon"
                [ngClass]="!item.expanded ? 'fas fa-angle-right': 'fas fa-angle-down'"
            ></i>
          </a>
          <a class="sublevel-sidebar-link"
            *ngIf="!item.items || (item.items && item.items.length === 0)"
            [routerLink]="[item.routerLink]"
            routerLinkActive="active-sublevel"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <i class="sublevel-link-icon fa fa-circle"></i>
            <span class="sublevel-link-text" [@fadeInOut]
              *ngIf="collapsed">{{item.label}}</span>
          </a>
          <div *ngIf="item.items && item.items.length > 0">
            <app-sublevel-menu
              [data]="item"
              [collapsed]="collapsed"
              [multiple]="multiple"
              [expanded]="item.expanded">
            </app-sublevel-menu>
          </div>
      </li>
    </ul>
  `,
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    fadeInOut,
    submenu
  ]

})
export class SublevelMenuComponent implements OnInit {
  @Input() data: ISidebarData = {
    routerLink: "",
    icon: "",
    label: "",
    items: [],
  }
  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  handleClick(item: any): void {
    if (!this.multiple) {
      if (this.data.items && this.data.items.length > 0) {
        for (let modelItem of this.data.items) {
          if (item !== modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }

    }
    item.expanded = !item.expanded;
  }

}
