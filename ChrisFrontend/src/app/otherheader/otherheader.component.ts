import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OutsideClickDirective } from '../outside-click.directive';
import { SearchService } from '../search.service';
import { CartServiceService } from '../cart-service.service';
import { AuthGuard } from '../auth.guard';
import { IpAddressService } from '../ip-address.service';
import { Cart } from '../cart';
import { CartItemService } from '../cart-item-service.service';
import { CartItem } from '../cart-item';
import { Items } from '../items';

@Component({
  selector: 'app-otherheader',
  templateUrl: './otherheader.component.html',
  styleUrls: ['./otherheader.component.css']
})
export class OtherheaderComponent {
  isSearchBarOpen= false;
  isLoggedIn=false;
  cart:Cart=new Cart();
  cartItem:CartItem= new CartItem();
  cartItems: CartItem[] = [];
  constructor( private cartitemService:CartItemService,private router: Router,private search:SearchService,private authGuard:AuthGuard,private ipservice:IpAddressService,private cartService:CartServiceService){}
  toggleSearchBar(){
    
    this.isSearchBarOpen = !this.isSearchBarOpen;
    
    



}


ngOnInit() {
    
  this.authGuard.getLoginStatus().subscribe((isLoggedIn: boolean) => {
    this.isLoggedIn = isLoggedIn;
    if (isLoggedIn) {
      sessionStorage.setItem('isLoggedIn', 'true');
    } else {
      sessionStorage.removeItem('isLoggedIn');
    
    }
  });

  this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  this.updateCartAndCartItems();
 
   
}
closeMenus(): void {
  
  this.isSearchBarOpen = false;
  
}


retrieveCartItems(): void {
  const cartId = sessionStorage.getItem('cartID');
  if (cartId) {
    this.cartitemService.getUserCart(Number(cartId)).subscribe(
      (cartItems: CartItem[]) => {
        this.cartItems = cartItems;
        this.getItemsForCartItems();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
updateCartAndCartItems(): void {
  this.cartService.createCartIfUserIdExists().subscribe(
    (data) => {
      this.cart = data;
      sessionStorage.setItem('cartID', this.cart.cartID);
      this.retrieveCartItems();
    },
    (error: any) => {
      console.log(error);
    }
  );
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
searchMethod(){
  const searchBarContent = (document.querySelector('.search-bar input') as HTMLInputElement).value;

  if (!searchBarContent) {

    this.router.navigate(['/search'])


  }else {
    // Perform the search operation with searchBarContent
    // Add your code here to handle the search operation
    this.search.searchcontent=searchBarContent
    console.log("header"+ " "+ this.search.searchcontent)
    
    this.router.navigate(['/search'])
  }







}
logout() {
  // Clear sessionStorage
  this.authGuard.updateLoginStatus(false);
  this.isLoggedIn=false
  this.router.navigateByUrl('/');
  sessionStorage.removeItem('cartID');
  sessionStorage.removeItem('Username')
  sessionStorage.setItem('isLoggedIn', 'false')
  this.ipservice.getIpAddress()
    .then((ipAddress: string) => {
       
      sessionStorage.setItem('ip',ipAddress)
      console.log(sessionStorage.getItem('ip'))
    })
    .catch((error) => {
      console.error('Error retrieving IP address:', error);
    });
    this.cartService.createCartIfUserIdExists().subscribe(
      (data) => {
       
        this.cart = data;
        sessionStorage.setItem('cartID',this.cart.cartID)
      },
      (error: any) => {
        console.log(error);
      }
    );
  // Optionally, you can also redirect the user to the login page or perform any other actions.
}


}
