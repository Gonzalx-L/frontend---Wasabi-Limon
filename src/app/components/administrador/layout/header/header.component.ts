import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay'
import { CdkMenuModule } from '@angular/cdk/menu'
import { languagesData, notifications, userItems } from './header-dummy-data';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, OverlayModule, CdkMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})


export class HeaderComponent implements OnInit {

  @Input() collapsed = false;
  @Input() screenWidth = 0;
  canShowSearchAsOverlay = false;
  selectLanguage: any;
  languajes = languagesData;
  notifications = notifications;
  userItems = userItems;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService, private router: Router) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.CheckCanShowSearchAsOverlay(window.innerWidth);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.CheckCanShowSearchAsOverlay(window.innerWidth);
      this.selectLanguage = this.languajes[0];
    }
  }


  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  CheckCanShowSearchAsOverlay(innerWidth: number): void {
    if (innerWidth < 845) {
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false;
    }
  }
 onUserItemClick(item: any) {
  if (item.label === 'Salir') {
    this.authService.logout(); // limpia localStorage y realiza POST si lo implementaste
    this.router.navigate(['/login']);
  }
}

}
