import { Component, Output, EventEmitter, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { navbarData, navbarDataCuenta  } from './nav-data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SublevelMenuComponent } from "./sublevel-menu.component";
import { fadeInOut, ISidebarData, rotate} from './helper';

interface SideBarToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule, SublevelMenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    fadeInOut,
    rotate
  ]
})
export class SidebarComponent implements OnInit {

  @Output() onToggleSideBar: EventEmitter<SideBarToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  navDataCuenta = navbarDataCuenta;
  multiple: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 768) {
        this.collapsed = false;
        this.onToggleSideBar.emit({
          collapsed: this.collapsed,
          screenWidth: this.screenWidth
        });
      }
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
    }
  }


  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideBar.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })
  }

  closeSidebar(): void {
    this.collapsed = false;
    this.onToggleSideBar.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })
  }

  handleClick(item: ISidebarData):void{
    if(!this.multiple){
      for(let modelItem of this.navData){
        if(item !== modelItem && modelItem.expanded){
          modelItem.expanded= false;
        }
      }
    }
    item.expanded= !item.expanded
  }
}
