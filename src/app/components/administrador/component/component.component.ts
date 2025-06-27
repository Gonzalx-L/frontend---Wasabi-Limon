import { Component } from '@angular/core';
import { SidebarComponent } from '..//layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../layout/header/header.component';
import { BodyComponent } from "../body/body.component";

interface SideBarToggle{
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-component',
  imports: [CommonModule, RouterModule, SidebarComponent, BodyComponent,HeaderComponent],
  templateUrl: './component.component.html',
  styleUrl: './component.component.scss'
})
export class ComponentComponent {

  isSideNavCollapsed= false;
  screenWidth=0;

  onToggleSideBar(data: SideBarToggle):void{
    this.screenWidth=data.screenWidth;
    this.isSideNavCollapsed=data.collapsed
  }
}
