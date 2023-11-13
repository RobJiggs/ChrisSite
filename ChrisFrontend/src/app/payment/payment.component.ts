import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../address.service';
import { CartItem } from '../cart-item';
import { CartItemService } from '../cart-item-service.service';
import { ShippingService } from '../shipping.service';
import { UserService } from '../user.service';
import { Items } from '../items';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { HttpClient } from '@angular/common/http';
import { Orders } from '../orders';
import { OrdersService } from '../orders.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
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
  method:string='';
  order:Orders=new Orders();
  showSuccess = false;
  showFailure=false;
  errorMsg = '';
  successMsg = '';
  baseUrl = 'localhost:8080';
  constructor(private ordersService:OrdersService,private http: HttpClient,private shippingService: ShippingService,private route: ActivatedRoute,private cartitemService:CartItemService,private sanitizer: DomSanitizer,private addyService:AddressService,private signupService: UserService,private router:Router) { }
  cartId:any;
  public payPalConfig?: IPayPalConfig;
 
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
    this.method=parsedDetails.method;
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
    this.method=this.shippingService.method;
    this.cartId=sessionStorage.getItem('cartID');
    
    this.cartitemService.getUserCart(Number(this.cartId)).subscribe((cartItems: CartItem[]) => {
      this.cartItems = cartItems; // 
      console.log(cartItems)
      this.getItemsForCartItems()
      const savedShippingDetails = localStorage.getItem('shippingDetails');
  if (savedShippingDetails) {
      const parsedDetails = JSON.parse(savedShippingDetails);
      console.log(parsedDetails.method+" parsedDetails method")
      // Process the cartItems as needed
      this.method=parsedDetails.method
  }
    });

    
    this.initConfig();

}

private initConfig(): void {
  this.payPalConfig = {
    currency: 'USD',
    clientId: 'Ab7tGZYtKJhQi6MOcuBy2ZNcC2iVi-P5fmzBrjLb7SWG0nj_gjiDMz79WpCUCNqQxr5jHe72NteI8e6J',
    createOrderOnClient: (data: any) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: this.calculatePostTotal().toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: this.calculatePostTotal().toFixed(2)
              }
            }
          },
          items: this.cartItems.map((cartItem) => {
            const valuePerItem = ((cartItem.price *1.1) + this.calculateShipping()/this.cartItems.length).toFixed(2)
            return {
              name: cartItem.itemname,
              quantity: cartItem.quantity.toString(),
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'USD',
                value: valuePerItem
              }
            };
          })
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data: any, actions: { order: { get: () => Promise<any>; }; }) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then(details => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data: any) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);

      this.showSuccess = true;
      
      this.successMsg = 'Payment successful!';
      this.createOrder();
    },
    onCancel: (data: any, actions: any) => {
      console.log('OnCancel', data, actions);
    },
    onError: (err: any) => {
      console.log('OnError', err);
      this.showFailure = true;
      this.errorMsg = 'Payment failed. Please try again.';
      if (this.payPalConfig) {
        this.payPalConfig.style = { layout: 'vertical' };
      }
    },
    onClick: (data: any, actions: any) => {
      console.log('onClick', data, actions);
    },
  };
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
goToShipping() {
  
  

  this.router.navigate(['/shipping']);
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
  const postTaxAndShippingTotal = this.calculateTotalPrice() + this.calculateShipping() + this.calculateTax();
  
  // Round the result to two decimal places
  return parseFloat(postTaxAndShippingTotal.toFixed(2));
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
    method: this.method,
    shippingdetail: this.shippingdetail
  };
  localStorage.setItem('shippingDetails', JSON.stringify(shippingDetails));
}

createOrder() {
  // Prepare the cart details
  const cartDetails = {
    cart_id:sessionStorage.getItem('cartID'), // Replace with your cart ID
    addy_details: this.city+","+this.state+" "+this.zipCode+" "+this.country, // Replace with the address details
    total_price:this.calculatePostTotal(),
    shipto:this.firstName+" "+this.lastName,
  
  };

  


  // Call the addOrderItems method
  this.ordersService.addOrderItems(cartDetails).subscribe(
    (order: Orders) => {
      // Order created successfully, do something with the order object
      this.showSuccess = true;
      this.successMsg = 'Order created successfully!';
      console.log('Order created:', order);
      sessionStorage.setItem('OrderId',order.orderNumber)
      console.log(order.orderNumber+" ordernumber")
      this.sendOrderConfirmationEmail(order.orderNumber,this.email)
      sessionStorage.removeItem('shippingDetails');
      
      
      
      setTimeout(() => {
        this.router.navigate(['/orderconfirm', order.orderNumber]);

      }, 100);
      

      
    },
    (error) => {
      // Handle the error
      console.error('Error creating order:', error);
      this.showFailure = true;
      this.errorMsg = 'Failed to create order. Please try again.';
    }
  );

  


}



sendOrderConfirmationEmail(orderId: number, email: string): Observable<string> {
  console.log(email,"email is here")
  const url = `${this.baseUrl}/api/user/${orderId}/${email}/send-confirmation-email`;
  
  return this.http.post<string>(url, {}).pipe(
    catchError((error: any) => {
      // Handle error
      console.error('Failed to send order confirmation email:', error);
      throw error; // Rethrow the error or return a custom error message
    })
  );
}





}
