import { HttpHeaderResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { CartMenuToggleService } from './cart-menu-toggle.service';

@Injectable({
  providedIn: 'root'
})
export class CartmenuService {
  
 
  

  
  constructor(private cartMenuToggleService:CartMenuToggleService) { }
  toggleCartMenu(): void {
    this.cartMenuToggleService.toggleCartMenu(true);
  }

 
}
