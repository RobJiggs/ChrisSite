import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Items } from '../items';
import { ItemsService } from '../items.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CartItemService } from '../cart-item-service.service';
import { CartServiceService } from '../cart-service.service';
import { Cart } from '../cart';
import { CartBadgeService } from '../cart-badge.service';
import { CartItem } from '../cart-item';
@Component({
  selector: 'app-female-clothing',
  templateUrl: './female-clothing.component.html',
  styleUrls: ['./female-clothing.component.css']
})
export class FemaleClothingComponent {
  item: Items= new Items();
  items: any;
  Sizes: string[] = [];
hoveredItem: Items | null = null;
showSizes: boolean = false;
showAddedToCartPopup: boolean = false;
addedItemName: string = '';
cart:Cart= new Cart();

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const dateadded = params['dateadded'];
      const category = params['category'];
      
      if (dateadded) {
        // Handle the 'dateadded' parameter
        console.log('Date Added:', dateadded);
        // Perform actions based on the 'dateadded' parameter

        this.searchItems('Female', undefined, undefined, undefined, undefined, undefined, dateadded, undefined)
      }
  
     else if (category) {
        // Handle the 'category' parameter
        console.log('Category:', category);
        // Perform actions based on the 'category' parameter
        this.searchItems('Female', category, undefined, undefined, undefined, undefined, undefined, undefined)
      } else {
        // Handle the case when there are no 'dateadded' or 'category' parameters
        this.searchItems('Female', undefined, undefined, undefined, undefined, undefined, undefined, undefined);
      }
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

  }
  constructor(private cartBadgeService: CartBadgeService,private route: ActivatedRoute,private cartService: CartServiceService,private cartitemService:CartItemService,private signupService:ItemsService,private router:Router,private sanitizer: DomSanitizer) { }
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
        // Check if no items found and fallback to all female clothing ordered by date
        if (data.length === 0 && sex === 'Female' && category === undefined && dateAdded !== undefined) {
          this.searchItems('Female', undefined, undefined, undefined, undefined, undefined, undefined, undefined);
          this.items.sort((a: Items, b: Items) => b.dateAdded.getTime() - a.dateAdded.getTime());
        }

      },
      error => console.log(error)
    );
    
  }
  

  sanitizeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
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
    console.log("Leave is working");
    item.showSizes = false;
  }
  
  
  getItemSizes(name: string, color: string, sex:string) {
  

    this.signupService.getItemSizes(name, color,sex).subscribe(
      (data: any) => {
         // Log the complete response
        this.Sizes = data as string[];
        this.Sizes = this.Sizes.sort((a, b) => {
          const sizeOrder = ['XL', 'large', 'medium', 'small', 'XS'];
          return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
        });
        
      },
      error => console.log(error)
    );
   
  }
  
  //triggerToggleCartMenu(): void {
    //this.cartMenuService.toggleCartMenu();
  
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
  
}
