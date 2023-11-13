import { Component } from '@angular/core';
import { Orders } from '../orders';
import { OrdersService } from '../orders.service';
import { OrderItem } from '../order-item';
import { OrderItemService } from '../order-item-service.service';
import { Items } from '../items';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent {
  order:Orders=new Orders();
  orderItems:OrderItem[]=[];
  orderNumber!: number;
  
  
  constructor(private route: ActivatedRoute,private ordersService:OrdersService,private orderitemService:OrderItemService,private sanitizer: DomSanitizer){}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.orderNumber = params['onumber']; // Assign the parameter value to orderNumber

  
      // Now you can use the 'orderNumber' in your component
      console.log('Order Number:', this.orderNumber);
    });


      this.getOrderDetails();
      this.getItemsForOrderItems();
      
    
     




  }

  sanitizeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getOrderDetails() {
    this.ordersService.getOrder(this.orderNumber).subscribe(
      (order: Orders) => {
        this.order = order;
        
      },
      (error) => {
        console.log('Error retrieving order:', error);
      }
    );

    this.ordersService.getOrderItems(this.orderNumber).subscribe(
      (orderItems: OrderItem[]) => {
        this.orderItems = orderItems;
      },
      (error) => {
        console.log('Error retrieving order items:', error);
      }
    );

    
  }



  getItemsForOrderItems(): void {
    this.ordersService.getOrderItems(this.orderNumber).subscribe(
      (orderItems: OrderItem[]) => {
        this.orderItems = orderItems;
  
        // Now that orderItems is populated, you can work with it here
        this.orderItems.forEach((orderItem: OrderItem) => {
          this.orderitemService.getItemInfo(orderItem.orderitemID).subscribe((items: Items) => {
            // Process the items as needed for each cartItem
            if (items.sex === 'Male') {
              orderItem.itemname = "Men's " + items.itemName;
            }
            if (items.sex === 'Female') {
              orderItem.itemname = "Women's " + items.itemName;
            }
            orderItem.itemname = items.size + " " + orderItem.itemname;
            orderItem.itempic = items.image;
          });
        });
      },
      (error) => {
        console.log('Error retrieving order items:', error);
      }
    );
  }
    

}
