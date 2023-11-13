import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartMenuToggleService {

  constructor() { }
  private toggleSource = new Subject<boolean>();

  toggleCartMenu(isOpen: boolean): void {
    this.toggleSource.next(isOpen);
  }

  getToggleObservable() {
    return this.toggleSource.asObservable();
  }
}
