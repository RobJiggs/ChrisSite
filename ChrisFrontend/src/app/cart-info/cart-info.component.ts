import { Component } from '@angular/core';
import { Cart } from '../cart';
import { CartItem } from '../cart-item';
import { CartItemService } from '../cart-item-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Items } from '../items';

@Component({
  selector: 'app-cart-info',
  templateUrl: './cart-info.component.html',
  styleUrls: ['./cart-info.component.css']
})
export class CartInfoComponent {
  constructor(private cartitemService:CartItemService,private sanitizer: DomSanitizer){}

  cart:Cart=new Cart();
  carts:any;
  cartItem:CartItem= new CartItem();
  cartItems: CartItem[] = [];
  hoveredCartItem: CartItem | null = null;
  cartId:any;




  ngOnInit() { 

    this.cartId=sessionStorage.getItem('cartID');
    
    
    this.cartitemService.getUserCart(Number(this.cartId)).subscribe((cartItems: CartItem[]) => {
    this.cartItems = cartItems; // 
    console.log(cartItems)
    this.getItemsForCartItems()
    // Process the cartItems as needed
  });
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
  deleteCartItem(cartItem: CartItem): void {
    this.cartitemService.deleteCartItem(cartItem.cartitemID).subscribe(
      () => {
        // Remove the item from the cartItems array
        this.cartItems = this.cartItems.filter((item) => item.cartitemID !== cartItem.cartitemID);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }


}
