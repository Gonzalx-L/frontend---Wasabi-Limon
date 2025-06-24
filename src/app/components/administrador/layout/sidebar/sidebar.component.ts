import { Component } from '@angular/core';
import {navbarData} from './nav-data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

  collapsed = false;
  navData = navbarData;

  toggleCollapsed():void{
    this.collapsed=!this.collapsed;
  }

  closeSidebar(): void {
    this.collapsed=false;
  }
}
