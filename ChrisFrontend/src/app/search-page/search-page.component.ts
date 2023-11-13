import { Component, ElementRef, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
import { ItemsService } from '../items.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Items } from '../items';
import { CartItemService } from '../cart-item-service.service';
import { CartServiceService } from '../cart-service.service';
import { CartmenuService } from '../cartmenu.service';
import { MatSliderChange } from '@angular/material/slider';
import { AuthGuard } from '../auth.guard';
import { IpAddressService } from '../ip-address.service';
import { Cart } from '../cart';



@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  constructor(private authGuard:AuthGuard,private ipservice:IpAddressService,private elementRef: ElementRef,private search:SearchService,private router:Router,private signupService:ItemsService,private sanitizer: DomSanitizer,private cartitemService:CartItemService,private cartService: CartServiceService,private cartMenuService: CartmenuService){}
  item: Items= new Items();
  items: any;
  intial:string=''
  Sizes: string[] = [];
  hoveredItem: Items | null = null;
  showSizes: boolean = false;
  showAddedToCartPopup: boolean = false;
  addedItemName: string = '';
  selectedSortOption: string = 'relevance';
  initialItems: any;
  isSearchBarOpen= false;
  isAdvancedSearchOpen: boolean = false;
  advancedSearchSex:string=''
  advancedSearchCategory:string=''
  advancedSearchColor:string='';
  advancedSearchMinPrice: number = 0;
  advancedSearchMaxPrice: number = 100;
  advancedSearchSize:string='';
  advancedSearchItemName:string=''
  advancedSearchDateAdded: Date | null = null;
  advancedSearchFeatured:boolean=false;
  isLoggedIn=false;
  cart:Cart=new Cart();
  
  // Initial range values
  

  onSliderChange(event: MatSliderChange): void {
    this.advancedSearchMinPrice = event.value as number;
    this.advancedSearchMaxPrice = event.value as number;
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
  
  ngOnInit() {
    
    this.intial=this.search.searchcontent
    if (this.intial) {
      this.searchItems(undefined, undefined, undefined, undefined, undefined, undefined, this.intial, undefined, undefined);
    }  else {
      this.getallItems();
    }
  }

  


  toggleAdvancedSearch() {
    this.isSearchBarOpen = false; // Close the search bar
    this.isAdvancedSearchOpen = !this.isAdvancedSearchOpen; // Toggle the advanced search menu
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
      this.initialItems = [...this.items];
      
      
    },
    error => console.log(error)
  );
}


sanitizeImageUrl(url: string): SafeUrl {
  return this.sanitizer.bypassSecurityTrustUrl(url);
}

getallItems(){
  this.signupService.getItemList().subscribe(data=>{this.items=data;this.initialItems = [...this.items];
    console.log(this.items)
  },error=>console.log(error));

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
  console.log(item + " this is working ");
  item.showSizes = true;
  this.getItemSizes(item.itemName, item.color,item.sex);
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
      console.log(this.Sizes);
    },
    error => console.log(error)
  );

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
        this.cartMenuService.toggleCartMenu()
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
        setTimeout(() => {
          this.scrollToPop();
        }, 100);
  
      },
      (error) => {
        // Handle the error, if needed
      }
    );
  }

  sortItems() {
    if (this.selectedSortOption === 'relevance') {
      this.resetItems()
    } else if (this.selectedSortOption === 'dateMostRecent') {
      this.items.sort((a: Items, b: Items) => b.dateAdded.getTime() - a.dateAdded.getTime());
    } else if (this.selectedSortOption === 'dateLeastRecent') {
      this.items.sort((a: Items, b: Items) => a.dateAdded.getTime() - b.dateAdded.getTime());
    } else if (this.selectedSortOption === 'priceHighToLow') {
      this.items.sort((a: Items, b: Items) => b.price - a.price);
    } else if (this.selectedSortOption === 'priceLowToHigh') {
      this.items.sort((a: Items, b: Items) => a.price - b.price);
    }
  }

  resetItems() {
    // Restore items to their initial state
    this.items = [...this.initialItems];
  }

  scrollToPop() {
    const errorContainer = this.elementRef.nativeElement.querySelector('#Popup');
    if (errorContainer) {
      errorContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }
  toggleSearchBar(){
    
    this.isSearchBarOpen = !this.isSearchBarOpen;
    
    



}
closeMenus(): void {
  
  this.isSearchBarOpen = false;
  
}

searchMethod(){
  const searchBarContent = (document.querySelector('.search-bar input') as HTMLInputElement).value;

  if (!searchBarContent) {

    
    this.getallItems();

  }else {
    this.searchItems(undefined, undefined, undefined, undefined, undefined, undefined, searchBarContent, undefined, undefined);
    
  }




}
toggleAdvancedSearchBar(){

  this.isAdvancedSearchOpen = !this.isAdvancedSearchOpen;



}
performAdvancedSearch(){
  console.log(this.advancedSearchDateAdded)
  const dateString='';
  if(this.advancedSearchDateAdded){
  const dateString: string = this.advancedSearchDateAdded.toString();}
  this.searchItems( this.advancedSearchSex,
    this.advancedSearchCategory,
    this.advancedSearchColor,
    this.advancedSearchMinPrice,
    this.advancedSearchMaxPrice,
    this.advancedSearchSize,
    this.advancedSearchItemName,
    dateString,
    this.advancedSearchFeatured)
    this.isSearchBarOpen = !this.isSearchBarOpen;
    this.isAdvancedSearchOpen = !this.isAdvancedSearchOpen;




}






}