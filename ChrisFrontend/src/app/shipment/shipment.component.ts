import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../address.service';
import { CartItem } from '../cart-item';
import { CartItemService } from '../cart-item-service.service';
import { UserService } from '../user.service';
import { Items } from '../items';
import { ShippingService } from '../shipping.service';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.css']
})
export class ShipmentComponent implements OnInit {
  formSubmitted: boolean =false;
  country: string = '';
  firstName: string = '';
  lastName: string = '';
  address: string = '';
  city: string = '';
  state: string = '';
  zipCode: string = '';
  email:string='';
  etc:string=''
  shippingdetail:string=''
  cartItems: CartItem[] = [];
  selectedShippingMethod:string=''
  constructor(private shippingService: ShippingService,private route: ActivatedRoute,private cartitemService:CartItemService,private sanitizer: DomSanitizer,private addyService:AddressService,private signupService: UserService,private router:Router) { }
  cartId:any;
  ngOnInit() {

    const savedShippingDetails = localStorage.getItem('shippingDetails');
  if (savedShippingDetails) {
    const parsedDetails = JSON.parse(savedShippingDetails);
    this.country = parsedDetails.country;
    this.firstName = parsedDetails.firstName;
    this.lastName = parsedDetails.lastName;
    this.address = parsedDetails.address;
    this.city = parsedDetails.city;
    this.state = parsedDetails.state;
    this.zipCode = parsedDetails.zipCode;
    this.email = parsedDetails.email;
    this.etc = parsedDetails.etc;
    this.shippingdetail = parsedDetails.shippingdetail;
  } else {
    this.country = this.shippingService.country;
    this.firstName = this.shippingService.firstName;
    this.lastName = this.shippingService.lastName;
    this.address = this.shippingService.address;
    this.city = this.shippingService.city;
    this.state = this.shippingService.state;
    this.zipCode = this.shippingService.zipCode;
    this.email = this.shippingService.email;
    console.log(this.email)}
    if(this.etc){
    this.shippingdetail=this.address+" "+this.etc+","+this.city+ " "+this.state+"," + this.country;
    this.etc=this.shippingService.etc;
    }
    else{

      this.shippingdetail=this.address+","+this.city+ " "+this.state+"," + this.country;

    }
    this.cartId=sessionStorage.getItem('cartID');
    
    this.cartitemService.getUserCart(Number(this.cartId)).subscribe((cartItems: CartItem[]) => {
      this.cartItems = cartItems; // 
      console.log(cartItems)
      this.getItemsForCartItems()
      // Process the cartItems as needed
    });
}
isShippingMethodInvalid(): boolean {
  return this.formSubmitted && (!this.selectedShippingMethod || this.selectedShippingMethod.trim().length === 0);
}
goToCheckout() {
  

  this.router.navigate(['/checkout']);
}



goToPayment() {
  this.formSubmitted = true;
  
  if(this.selectedShippingMethod){this.shippingService.method=this.selectedShippingMethod;
    this.shippingService.saveShippingDetailsToLocalStorage();
    this.saveShippingDetails();
    
    this.router.navigate(['/payment']);}
  
}


getItemsForCartItems(): void {
  this.cartItems.forEach((cartItem: CartItem) => {
    this.cartitemService.getItemInfo(cartItem.cartitemID).subscribe((items: Items) => {
      // Process the items as needed for each cartItem
      
      if(items.sex='Male'){
        cartItem.itemname="Men's "+items.itemName


      }
      if(items.sex='Female'){
        cartItem.itemname="Women's "+items.itemName


      }
      cartItem.itemname=items.size+" "+cartItem.itemname

      cartItem.itemPic=items.image
      console.log(items);
    });
  });
}  
sanitizeImageUrl(url: string): SafeUrl {
  return this.sanitizer.bypassSecurityTrustUrl(url);
}
calculateTotalPrice(): number {
  let total = 0;
  for (const cartItem of this.cartItems) {
    total += cartItem.price * cartItem.quantity;
  }
  return total;
}
calculateShipping(): number {
  // Calculate shipping logic here
  // Return the shipping cost
  return 10.0;
}

calculateTax(): number {
  // Calculate tax logic here
  // Return the tax amount
  return this.calculateTotalPrice() * 0.1; // Assuming tax rate is 10%
}

calculatePostTotal(): number {
  // Calculate post-tax and shipping total
  return this.calculateTotalPrice() + this.calculateShipping() + this.calculateTax();
}
goToEmailField() {
  this.router.navigate(['/checkout'], { fragment: 'emailField' });
}

goToAddyField() {
  this.router.navigate(['/checkout'], { fragment: 'addyField' });
}


saveShippingDetails() {
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
    method:this.selectedShippingMethod,
    shippingdetail: this.shippingdetail
  };
  localStorage.setItem('shippingDetails', JSON.stringify(shippingDetails));
}
}


