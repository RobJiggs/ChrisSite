import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  country: string = '';
  firstName: string = '';
  lastName: string = '';
  address: string = '';
  city: string = '';
  state: string = '';
  zipCode: string = '';
  email: string = '';
  etc:string=''
  shippingdetail: string = '';
  method:string=''

  saveShippingDetailsToLocalStorage() {
    const shippingDetails = {
      country: this.country,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      email: this.email,
      etc: this.etc,
      method:this.method,
      shippingdetail: this.shippingdetail
    };
    localStorage.setItem('shippingDetails', JSON.stringify(shippingDetails));
  }
}
