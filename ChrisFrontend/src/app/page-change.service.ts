import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IpAddressService } from './ip-address.service';
import { CartServiceService } from './cart-service.service'
import { Cart } from './cart';

@Injectable({
  providedIn: 'root',
})
export class PageChangeService {
  cart: Cart=new Cart()
  constructor(private router: Router, private ipAddressService: IpAddressService, private cartService: CartServiceService) {
    this.initialize();
  }

  private initialize(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.ipAddressService
          .getIpAddress()
          .then((ipAddress: string) => {
            sessionStorage.setItem('ip', ipAddress);
            console.log(sessionStorage.getItem('ip')+"IP Page change");
          })
          .catch((error) => {
            console.error('Error retrieving IP address:', error);
          });

        this.cartService.createCartIfUserIdExists().subscribe(
          (data) => {
            this.cart = data;
            sessionStorage.setItem('cartID', this.cart.cartID);
            console.log(sessionStorage.getItem('cartID')+" cart Page change");
          },
          (error: any) => {
            console.log(error);
          }
        );
      }
    });
  }
}
