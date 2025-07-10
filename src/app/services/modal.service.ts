import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  private modals: { [key: string]: boolean } = {};
  private boletaSubject = new BehaviorSubject<any>(null);
  private codBolSubject = new BehaviorSubject<string | null>(null);


  constructor() { }

  // Mostrar modal por nombre
  showModal(modalName: string): void {
    this.modals[modalName] = true;
  }

  // Ocultar modal por nombre
  hideModal(modalName: string): void {
    this.modals[modalName] = false;
  }

  // Verificar si un modal está visible
  isModalVisible(modalName: string): boolean {
    return !!this.modals[modalName];
  }

  setDatosBoleta(boleta: any): void {
    this.boletaSubject.next(boleta);
  }

  getDatosBoleta() {
    return this.boletaSubject.asObservable();
  }

  setCodBol(codBol: string): void {
    this.codBolSubject.next(codBol);
  }

  getCodBol() {
    return this.codBolSubject.asObservable();
  }
}
