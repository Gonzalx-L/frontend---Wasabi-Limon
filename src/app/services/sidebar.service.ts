import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private toggleEvent = new Subject<void>();

  toggleEvent$ = this.toggleEvent.asObservable();

  emitToggle() {
    this.toggleEvent.next();
  }
}
