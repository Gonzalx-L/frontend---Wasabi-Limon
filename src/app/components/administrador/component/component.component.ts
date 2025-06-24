import { Component } from '@angular/core';
import { SidebarComponent } from '..//layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-component',
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './component.component.html',
  styleUrl: './component.component.scss'
})
export class ComponentComponent {

}
