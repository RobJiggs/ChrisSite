import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from '../items.service';
import { ItemSizesAndColors } from '../item-sizes-and-colors';
import { Items } from '../items';
import { HttpResponse } from '@angular/common/http';
import { CartItemService } from '../cart-item-service.service';
import { Cart } from '../cart';
import { CartServiceService } from '../cart-service.service';
import { ItemdetailService } from '../itemdetail.service';
@Component({
  selector: 'app-itemdetails',
  templateUrl: './itemdetails.component.html',
  styleUrls: ['./itemdetails.component.css']
})
export class ItemdetailsComponent {
  itemName=""
  itemInfoArray: ItemSizesAndColors[] = [];
  selectedItem:Items=new Items()
  item:Items=new Items()
  cart:Cart=new Cart()
  quantityOptions: number[] = Array.from({ length: 30 }, (_, i) => i + 1); // Creates an array from 1 to 30
  selectedQuantity: number = 1;
  price:number=1.00

  addedItemName=""
  showAddedtoCartPopup=false

  distinctSizes: string[]=[];
          
  distinctColors: string[] = [];
  distinctSexes: string[] = [];
  distinctPicture: string[] = [];
  selectedColor: string | null = null;
  selectedSex: string | null = null;
  selectedSize: string | null = null;
          
  

  constructor(private itemDetailsService: ItemdetailService,private router: Router,private route: ActivatedRoute, private itemservice:ItemsService,private cartItemService:CartItemService,private cartService:CartServiceService) {}
  
  ngOnInit() {
    // Access the route parameter 'name'
  
    
    this.route.params.subscribe(params => {
      
      this.itemName = params['name'];
      
      // Now you can use the 'itemName' in your component logic
      // For example, you can fetch item details based on 'itemName'
      // or display it in your template.
      
      this.itemservice.getInfoByName(this.itemName).subscribe(data => {
        if (Array.isArray(data)) {
          // Define the desired order of sizes
          const sizeOrder = ['XS', 'small', 'medium', 'large', 'XL'];
          
          // Initialize an object to store distinct sizes with a flag to mark them
          const distinctSizes: { [size: string]: boolean } = {};
          
          const distinctColors: string[] = [];
          const distinctSexes: string[] = [];
          const distinctPicture:string[]=[];
          
          // Loop through the data to collect distinct values
          data.forEach((itemData: [string, string, string,string]) => {
            const [size, color, sex,pic] = itemData;
            
            // Check if the size is in the predefined order and hasn't been marked as distinct yet
            if (sizeOrder.includes(size) && !distinctSizes[size]) {
              distinctSizes[size] = true; // Mark the size as distinct
            }
            
            // Collect distinct colors
            if (!distinctColors.includes(color)) {
              distinctColors.push(color);
            }
            
            // Collect distinct sexes
            if (!distinctSexes.includes(sex)) {
              distinctSexes.push(sex);
            }
            if (!distinctPicture.includes(pic)) {
              distinctPicture.push(pic);
            }

          });
          
          // Now you can build the distinct sizes array in the desired order
          const orderedDistinctSizes = sizeOrder.filter(size => distinctSizes[size]);
          
          // Now you have distinct sizes in the desired order

          this.distinctSizes=orderedDistinctSizes
          this.distinctColors=distinctColors
          this.distinctSexes=distinctSexes
          this.distinctPicture=distinctPicture
          console.log('Distinct Sizes:', orderedDistinctSizes);
          console.log('Distinct Colors:', distinctColors);
          console.log('Distinct Sexes:', distinctSexes);
          console.log('Pics',distinctPicture)
          this.changeItemPrice(this.itemName,this.distinctColors[0],this.distinctSexes[0],this.distinctSizes[0])



          if (this.distinctColors.length > 0) {
            this.selectedColor = this.distinctColors[0];
          }
      
          if (this.distinctSizes.length > 0) {
            this.selectedSize = this.distinctSizes[0];
          }
          console.log(this.distinctSizes)
      
          if (this.distinctSexes.length > 0) {
            this.selectedSex = this.distinctSexes[0];
          }
          // You can assign these arrays to component properties if needed
          // For example:
          // this.distinctSizes = orderedDistinctSizes;
          // this.distinctColors = distinctColors;
          // this.distinctSexes = distinctSexes;
        } else {
          console.error('Invalid data format: expected an array.');
        }
        this.itemDetailsService.selectedItem$.subscribe((selectedItem) => {
          // Update the component properties based on the selected item
          this.selectedColor = selectedItem.color;
          
          this.selectedSex = selectedItem.sex;
          this.changeItemPrice(this.itemName,selectedItem.color,selectedItem.sex,selectedItem.size)
        });

      });
      
     
      
      
      


    });



  }
  selectColor(color: string) {
    this.selectedColor = color;
    // You can add additional logic here, such as updating the item based on the selected color.
    console.log(this.distinctPicture[0])
    this.changeItemPic(this.itemName, this.selectedColor, this.selectedSex, this.selectedSize);
    this.changeItemPrice(this.itemName, this.selectedColor, this.selectedSex, this.selectedSize);
  }  

  selectSize(size:string){
    this.selectedSize=size
    this.changeItemPic(this.itemName, this.selectedColor, this.selectedSex, this.selectedSize);
    this.changeItemPrice(this.itemName, this.selectedColor, this.selectedSex, this.selectedSize);

  }
  selectSex(sex:string){
    this.selectedSex=sex


  }
  changeItemPic(name: any, color: any, sex: any, size: any) {
    this.itemservice.changeItemPic(name, color, sex, size).subscribe(
      (item: any) => {
       this.item=item
       this.distinctPicture[0]=this.item.image
       console.log(this.item.image)
      },
      (error: any) => {
        console.error('Error occurred while changing item picture:', error);
      }
    );
  }
  changeItemPrice(name: any, color: any, sex: any, size: any) {
    this.itemservice.changeItemPic(name, color, sex, size).subscribe(
      (item: any) => {
       this.item=item
       this.price=this.item.price
      },
      (error: any) => {
        console.error('Error occurred while changing item picture:', error);
      }
    );
  }




  addtoCart(name: any, color: any,sex:any, size: any,quantity:any){
    
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
      const itemRequest = {
        name: name,
        color: color,
        sex: sex, 
        size: size,
        quantity:quantity,
        cartID: sessionStorage.getItem('cartID'), 
      };
      this.cartItemService.createCartItemQuantity(itemRequest).subscribe(
        (response) => {
          
          
          if(sex=="Male"){
            this.addedItemName = "Men's"+" " +name;
          }
          if(sex=="Female"){
            this.addedItemName = "Women's"+" " +name;
          }
    
          this.addedItemName=size+" "+this.addedItemName;
          this.showAddedtoCartPopup = true;
          setTimeout(() => {
            this.showAddedtoCartPopup = false;
            this.addedItemName = '';
            this.router.navigate(['/'])
          }, 3000);
    
        },
        (error) => {
          // Handle the error, if needed
        }
      );


  }

  

}
