import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Items } from '../items';
import { ItemsService } from '../items.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IpAddressService } from '../ip-address.service';
import { CartItemService } from '../cart-item-service.service';
import { Cart } from '../cart';
import { CartServiceService } from '../cart-service.service';
import { CartmenuService } from '../cartmenu.service';
import { HeaderComponent } from '../header/header.component';
import { CartItem } from '../cart-item';
import { CartBadgeService } from '../cart-badge.service';
import { SizeSelectionService } from '../size-selection.service';
import { ItemdetailService } from '../itemdetail.service';
@Component({
  selector: 'app-items-services',
  templateUrl: './items-services.component.html',
  styleUrls: ['./items-services.component.css']
})

  
export class ItemsServicesComponent {

item: Items= new Items();
cart:Cart= new Cart();
items: any;
showCartMenu: boolean = false;

ipAddress!: string;
Sizes: string[] = [];
hoveredItem: Items | null = null;
showSizes: boolean = false;
showAddedToCartPopup: boolean = false;
addedItemName: string = '';
cartItem:CartItem= new CartItem();
cartItems: CartItem[] = [];
cartItemsCount=0;

  constructor(private itemDetailsService: ItemdetailService,private sizeSelectionService: SizeSelectionService,private cartBadgeService: CartBadgeService,private signupService:ItemsService,private router:Router,private sanitizer: DomSanitizer,private ipAddressService: IpAddressService,private cartitemService:CartItemService,private cartService: CartServiceService,private cartMenuService: CartmenuService) { }
  ngOnInit(): void {
    this.searchItems(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
   
    this.ipAddressService.getIpAddress()
      .then((ipAddress: string) => {
        this.ipAddress = ipAddress;
        sessionStorage.setItem('ip',this.ipAddress)
        console.log(sessionStorage.getItem('ip')+"home")
      })
      .catch((error) => {
        console.error('Error retrieving IP address:', error);
      });

      this.cartService.createCartIfUserIdExists().subscribe(
        (data) => {
          this.cart = data;
          sessionStorage.setItem('cartID', this.cart.cartID);
          console.log(sessionStorage.getItem('cartID')+" cart home");
        },
        (error: any) => {
          console.log(error);
        }
      );
      
      this.cartitemService.getUserCart(Number(sessionStorage.getItem('cartID'))).subscribe(
        (cartItems: CartItem[]) => {
          
          let total=0;
          for (const cartItem of cartItems) {
            total += cartItem.quantity;
          }
          
          
          this.cartBadgeService.updateCartItemCount(total);
          
        },
        (error: any) => {
          console.log(error);
        }
      );
      console.log("total innit "+this.cartItems.length)


     
      
     this.cartTotal();

  }
  onSelectSize() {
    // Your logic for size selection in the itemservices component
    console.log('Size selected in itemservices component');
    this.sizeSelectionService.triggerSizeSelected();
  }
  getallItems(){
    this.signupService.getItemList().subscribe(data=>{this.items=data;
      console.log(this.items)
    },error=>console.log(error));

  }
  getItemNames(name:any){

    this.signupService.getItemContaining(name)
    .subscribe(
      (      data: any) => {
        console.log(data);
        
        this.signupService.getItemList().subscribe(data =>{
          this.items =data
          })
      },
      (      error: any) => console.log(error));

}



sanitizeImageUrl(url: string): SafeUrl {
  return this.sanitizer.bypassSecurityTrustUrl(url);
}




searchItems(
  sex?: string,
  category?: string,
  color?: string,
  minPrice?: number,
  maxPrice?: number,
  size?: string,
  itemName?: string,
  dateAdded?: string,
  featured?: boolean
) {
  this.signupService.searchItems(
    sex,
    category,
    color,
    minPrice,
    maxPrice,
    size,
    itemName,
    dateAdded,
    featured
  ).subscribe(
    data => {
      this.items = data;
      console.log(this.items);
      
    },
    error => console.log(error)
  );
}

getDisplayItemName(item: Items): string {
  if (item.sex === 'Male') {
    return "Men's " + item.itemName;
  }
  if(item.sex==='Female')
    return "Women's " +item.itemName;
  return item.itemName;
}

onMouseEnter(item: Items) {
  
  item.showSizes = true;
  this.getItemSizes(item.itemName, item.color,item.sex);
  this.cartTotal();
  console.log("mouse enter")

}

onMouseLeave(item: Items) {
 
  item.showSizes = false;
}


getItemSizes(name: string, color: string, sex:string) {
  

  this.signupService.getItemSizes(name, color,sex).subscribe(
    (data: any) => {
       // Log the complete response
      this.Sizes = data as string[];
      this.Sizes = this.Sizes.sort((a, b) => {
        const sizeOrder = ['XS', 'small', 'medium', 'large', 'XL'];
        return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
      });
      
    },
    error => console.log(error)
  );
 
}

//triggerToggleCartMenu(): void {
  //this.cartMenuService.toggleCartMenu();
openCart():void{



}
createCartItem(name: string, color: string,sex:string, size: string) {
  const itemRequest = {
    name: name,
    color: color,
    sex: sex, // Replace with the actual sex value
    size: size,
    cartID: sessionStorage.getItem('cartID'), // Replace with the actual cart ID
  };

  this.cartitemService.createCartItem(itemRequest).subscribe(
    (response) => {
      
      this.showAddedToCartPopup = true;
      if(sex=="Male"){
        this.addedItemName = "Men's"+" " +name;
      }
      if(sex=="Female"){
        this.addedItemName = "Women's"+" " +name;
      }

      this.addedItemName=size+" "+this.addedItemName;
      setTimeout(() => {
        this.showAddedToCartPopup = false;
        this.addedItemName = '';
      }, 3000);

    },
    (error) => {
      // Handle the error, if needed
    }
  );

 
  this.cartitemService.getUserCart(Number(sessionStorage.getItem('cartID'))).subscribe(
    (cartItems: CartItem[]) => {
      this.cartItems = cartItems;
    
    },
    (error: any) => {
      console.log(error);
    }
  );
 
  let total=0;

  this.cartBadgeService.cartItemCount$.subscribe((count) => {
    total = count;
  });

 
  
  this.cartBadgeService.updateCartItemCount(total+1); 




}

cartTotal():void {
  let total=0;

  this.cartBadgeService.cartItemCount$.subscribe((count) => {
    total = count;
  });

 
  
  this.cartBadgeService.updateCartItemCount(total); 

 console.log("total"+total)
 


}

navigateToItemDetail(itemName: string,item:Items) {
  // Use the Angular Router to navigate to the item detail page
  console.log("this is the right item", item,item.color,item.sex)
  this.itemDetailsService.setSelectedItem({item})
  this.router.navigate(['items', itemName]);
  // Emit the selected item to subscribers
  
}


}




  
 


