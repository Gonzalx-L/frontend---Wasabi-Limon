import { Component } from '@angular/core';
import { SidebarComponent } from '..//layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../layout/header/header.component';
import { BodyComponent } from "../body/body.component";
import { SidebarService } from '../../../services/sidebar.service';
import { ModalComponent } from "../boletas/modal/modal.component";

interface SideBarToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-component',
  imports: [CommonModule, RouterModule, SidebarComponent, BodyComponent, HeaderComponent, ModalComponent],
  templateUrl: './component.component.html',
  styleUrl: './component.component.scss'
})

export class ComponentComponent {

  isSideNavCollapsed = false;
  screenWidth = 0;

  constructor(private sidebarService: SidebarService) {}

  onToggleSideBar(data: SideBarToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed
    this.sidebarService.emitToggle();
  }
}
