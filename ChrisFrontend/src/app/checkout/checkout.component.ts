import { Component, ElementRef } from '@angular/core';
import { Items } from '../items';
import { Cart } from '../cart';
import { CartItem } from '../cart-item';
import { CartItemService } from '../cart-item-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { postcodeValidator, postcodeValidatorExistsForCountry } from 'postcode-validator';
import { UserService } from '../user.service';
import { User } from '../user';
import { AddressService } from '../address.service';
import { Address } from '../address';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { ShippingService } from '../shipping.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  formSubmitted: boolean =false;
  shippingdetail: any;
  constructor(private shippingService: ShippingService,private elementRef: ElementRef,private cartitemService:CartItemService,private sanitizer: DomSanitizer,private addyService:AddressService,private signupService: UserService,private router:Router){}
  item: Items= new Items();
  items: any;
  cart:Cart=new Cart();
  carts:any;
  cartItem:CartItem= new CartItem();
  cartItems: CartItem[] = [];
  cartId:any;
  user:User=new User();
  id:any;
  Address:Address=new Address();

  country: string ="";
  firstName: string ="";
  lastName: string ="";
  address: string ="";
  city: string ="";
  state: string ="";
  zipCode: string ="";
  
  etc:string="";
 
  emailControl = new FormControl('', [Validators.required, Validators.email]);

  isEmailValid: boolean = true;
 
  ngOnInit() { 

    this.cartId=sessionStorage.getItem('cartID');
    
    
    this.cartitemService.getUserCart(Number(this.cartId)).subscribe((cartItems: CartItem[]) => {
    this.cartItems = cartItems; // 
    
    console.log(cartItems)
    this.getItemsForCartItems()
    // Process the cartItems as needed
  });

  this.id=sessionStorage.getItem("userid")
  if(this.id){

    this.signupService.getUserById(this.id).subscribe(data=>{this.user=data;})
    this.firstName=this.user.firstName;
    this.lastName=this.user.lastName
    this.addyService.getMainAddress(this.id).subscribe(data=>{this.Address=data;})
    this.country=this.Address.country;
    this.address=this.Address.street;
    this.city=this.Address.city;
    this.state=this.Address.state;
    this.zipCode=this.Address.zipcode;
    this.etc=this.Address.etc;
    this.emailControl.setValue(this.user.email);
  }
  if (this.shippingService.country && this.shippingService.firstName && this.shippingService.lastName &&
    this.shippingService.address && this.shippingService.city && this.shippingService.state &&
    this.shippingService.zipCode && this.shippingService.email) {
  // Populate the form fields with the shipping values
  this.country = this.shippingService.country;
  this.firstName = this.shippingService.firstName;
  this.lastName = this.shippingService.lastName;
  this.address = this.shippingService.address;
  this.city = this.shippingService.city;
  this.state = this.shippingService.state;
  this.zipCode = this.shippingService.zipCode;
  this.etc=this.shippingService.etc;
  this.emailControl.setValue(this.shippingService.email);
 
}
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
  this.emailControl.setValue(parsedDetails.email);
  this.etc = parsedDetails.etc;
  this.shippingdetail = parsedDetails.shippingdetail;
  console.log(this.emailControl.value+"email")



}

  }

scrollToErrors() {
  const errorContainer = this.elementRef.nativeElement.querySelector('#error-container');
  if (errorContainer) {
    errorContainer.scrollIntoView({ behavior: 'smooth' });
  }
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
  isFieldInvalid(field: string): boolean {
    if (field === 'country') {
      return this.formSubmitted && (!this.country || this.country.trim().length === 0);
    }
    if (field === 'firstName') {
      return this.formSubmitted && (!this.firstName || this.firstName.trim().length === 0);
    }
    if (field === 'lastName') {
      return this.formSubmitted && (!this.lastName || this.lastName.trim().length === 0);
    }
    if (field === 'address') {
      return this.formSubmitted && (!this.address || this.address.trim().length === 0);
    }
    if (field === 'city') {
      return this.formSubmitted && (!this.city || this.city.trim().length === 0);
    }
    if (field === 'state') {
      return this.formSubmitted && (!this.state || this.state.trim().length === 0);
    }
    if (field === 'zipCode') {
      
      return this.formSubmitted && (!this.zipCode || this.zipCode.trim().length === 0||!postcodeValidator(this.zipCode,this.country) );
      
    }
    return false;
  }
  
  gotoCartPage() {

    this.router.navigate(['/cart'])




  }
  continueToShipping() {
    this.formSubmitted = true;
    
    this.emailControl.updateValueAndValidity();
    const emailValue = this.emailControl.value || ''; 
    console.log(emailValue)
    this.isEmailValid = this.emailControl.valid;
    if (
      this.country &&
      this.firstName &&
      this.lastName &&
      this.address && 
      this.city &&
      this.state &&
      this.zipCode &&
      !this.isFieldInvalid('zipCode') &&
      this.isEmailValid
    ) {
    this.shippingService.country = this.country;
    this.shippingService.firstName = this.firstName;
    this.shippingService.lastName = this.lastName;
    this.shippingService.address = this.address;
    this.shippingService.city = this.city;
    this.shippingService.state = this.state;
    this.shippingService.zipCode = this.zipCode;
    this.shippingService.email = emailValue;
    this.shippingService.etc=this.etc;
    this.shippingService.saveShippingDetailsToLocalStorage();
    this.router.navigate(['/shipping']);
    } else {
      setTimeout(() => {
        this.scrollToErrors();
      }, 100);
    }
  }
  
  
}
