import { Component, EventEmitter, Output, ViewChild, ElementRef, Input, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ItemsService } from '../items.service';
import { Items } from '../items';
import { AuthGuard } from '../auth.guard';
import { CartServiceService } from '../cart-service.service'
import { CartItemService } from '../cart-item-service.service';
import { CartItem } from '../cart-item';
import { Cart } from '../cart';
import { IpAddressService } from '../ip-address.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CartmenuService } from '../cartmenu.service';
import { CartMenuToggleService } from '../cart-menu-toggle.service';
import { OutsideClickDirective } from '../outside-click.directive';
import { SearchService } from '../search.service';
import { MatBadgeModule } from '@angular/material/badge';
import { CartBadgeService } from '../cart-badge.service';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  
})


export class HeaderComponent {
  showCartMenu=false;
  constructor(private cartBadgeService: CartBadgeService,private renderer: Renderer2,private search:SearchService,private router: Router, private cartMenuToggleService:CartMenuToggleService, private signupService:ItemsService,private authGuard:AuthGuard,private cartService:CartServiceService,private cartitemService:CartItemService,private sanitizer: DomSanitizer,private ipservice:IpAddressService ,private cartMenuService: CartmenuService) { }
  
  isMenuOpen = false;
  isSearchBarOpen= false;
  isCartMenuOpen = false;
  isLoggedIn=false;
  item: Items= new Items();
  items: any;
  cart:Cart=new Cart();
  carts:any;
  cartItem:CartItem= new CartItem();
  cartItems: CartItem[] = [];
  searchContent: string='';
  showWomenMenu: boolean = false;
  showMenMenu: boolean = false;
  showWomenSubMenu: boolean = false;
  showMenSubMenu: boolean = false;
  emptyItem=false;
  emptyItemMsg="";
  
  cartItemsCount=this.cartTotal();
 


  toggleWomenMenu(): void {
    this.showWomenMenu = !this.showWomenMenu;
  }

  toggleMenMenu(): void {
    this.showMenMenu = !this.showMenMenu;
  }

  toggleWomenSubMenu(): void {
    this.showWomenSubMenu = !this.showWomenSubMenu;
  }

  toggleMenSubMenu(): void {
    this.showMenSubMenu = !this.showMenSubMenu;
  }

  
  closeMenus(): void {
    this.isMenuOpen = false;
    this.isSearchBarOpen = false;
    this.isCartMenuOpen = false;
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
    
    this.cartBadgeService.cartItemCount$.subscribe((count) => {
      this.cartItemsCount = count;
    });
    



  }
  

  toggleLogin(): void {
    this.isLoggedIn = !this.isLoggedIn;
    if (this.isLoggedIn) {
      sessionStorage.setItem('isLoggedIn', 'true');
    } else {
      sessionStorage.removeItem('isLoggedIn');
    }
  }

  toggleCartMenu(): void {
    this.isCartMenuOpen=!this.isCartMenuOpen;
    
    console.log(sessionStorage.getItem('isLoggedIn'))
    
    if (this.isCartMenuOpen) {
      this.updateCartAndCartItems();

   

    
  }
  let total=0;
  for (const cartItem of this.cartItems) {
    total += cartItem.quantity;
  }
  
  
  this.cartBadgeService.updateCartItemCount(total);
  this.cartItemsCount=total;



}

cartTotal():number{

  let total=0;
  for (const cartItem of this.cartItems) {
    total += cartItem.quantity;
  }
  
  
  this.cartBadgeService.updateCartItemCount(total);
  return total;



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
retrieveCartItems(): void {
  const cartId = sessionStorage.getItem('cartID');
  if (cartId) {
    this.cartitemService.getUserCart(Number(cartId)).subscribe(
      (cartItems: CartItem[]) => {
        this.cartItems = cartItems;
        console.log("cart item"+cartItems.length)
        this.getItemsForCartItems();
        let total=0;
        for (const cartItem of this.cartItems) {
          total += cartItem.quantity;
        }
        this.cartItemsCount=total;
        
        
        this.cartBadgeService.updateCartItemCount(total);
      },
      (error: any) => {
        console.log(error);
      }
    );

   
  }
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


getItemsForCartItems(): void {
  this.cartItems.forEach((cartItem: CartItem) => {
    this.cartitemService.getItemInfo(cartItem.cartitemID).subscribe((items: Items) => {
      // Process the items as needed for each cartItem
      
      if(items.sex=='Male'){
        cartItem.itemname="Men's "+items.itemName


      }
      if(items.sex=='Female'){
        cartItem.itemname="Women's "+items.itemName


      }
      cartItem.itemname=items.size+" "+cartItem.itemname

      cartItem.itemPic=items.image
      console.log(items);
    });
  });
}
RemoveEmptyItems(){
  this.cartItems.forEach((cartItem: CartItem) => {
    this.cartitemService.getItemInfo(cartItem.cartitemID).subscribe((items: Items) => {
      if(items.available==false){

        const index=this.cartItems.indexOf(cartItem);
        if(index>-1){

          this.cartItems.splice(index, 1);
          this.emptyItem=true;
          this.emptyItemMsg="Item "+ cartItem.itemname+ "was removed from cart "
        }




        setTimeout(() => {
          this.emptyItem=false;
        }, 100);


      }
    });
  });




}



  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    console.log(this.isMenuOpen);
  }
  
  toggleSearchBar() {
    this.isSearchBarOpen = !this.isSearchBarOpen;
  }
  
  Womens(): void {
    this.router.navigate(['/womens']);
  }

  Mens(): void {
    this.router.navigate(['/mens']);
  }
  goToAccountPage(): void {
    this.router.navigate(['/account']);
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

  sanitizeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  decreaseQuantity(cartItem: CartItem): void {
  if (cartItem.quantity > 1) {
    cartItem.quantity--;
    this.updateCartItemQuantity(cartItem);
  }
  if(cartItem.quantity ===1){

    this.deleteCartItem(cartItem);

  }
}

increaseQuantity(cartItem: CartItem): void {
  cartItem.quantity++;
  this.updateCartItemQuantity(cartItem);
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

  let total=0;
  for (const cartItem of this.cartItems) {
    total += cartItem.quantity;
  }
  
  
  this.cartBadgeService.updateCartItemCount(total);
}

updateCartItemQuantity(cartItem: CartItem): void {
  this.cartitemService.updateCartItemQuantity(cartItem.cartitemID, cartItem.quantity).subscribe(
    (updatedCartItem: CartItem) => {
      // Update the cartItem with the updated values
      Object.assign(cartItem, updatedCartItem);
    },
    (error: any) => {
      console.log(error);
    }
  );
  let total=0;
  for (const cartItem of this.cartItems) {
    total += cartItem.quantity;
  }
  
  
  this.cartBadgeService.updateCartItemCount(total);
}

checkout() {
  this.toggleCartMenu()
  this.router.navigate(['/checkout']);






}


calculateTotalPrice(): number {
  let total = 0;
  for (const cartItem of this.cartItems) {
    total += cartItem.price * cartItem.quantity;
  }
  return total;
}

MensParams(parameter: string): void {
  if (parameter === 'New Arrivals') {
    const currentDate = new Date();
    const lastWeekDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);

    this.router.navigate(['/mens'], {
      queryParams: { dateadded:lastWeekDate.toISOString() },
      queryParamsHandling: 'merge'
    });
  } else if (parameter === 'Outerwear') {
    this.router.navigate(['/mens'], {
      queryParams: { category: 'Outerwear' },
      queryParamsHandling: 'merge'
    });
  }
}


WomensParams(parameter: string): void {
  if (parameter === 'New Arrivals') {
    const currentDate = new Date();
    const lastWeekDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);

    this.router.navigate(['/womens'], {
      queryParams: { dateadded:lastWeekDate.toISOString() },
      queryParamsHandling: 'merge'
    });
  } else if (parameter === 'Outerwear') {
    this.router.navigate(['/womens'], {
      queryParams: { category: 'Outerwear' },
      queryParamsHandling: 'merge'
    });
  }
}


  
}