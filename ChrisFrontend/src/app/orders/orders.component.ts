import { Component, OnInit } from '@angular/core';
import { Orders } from '../orders';
import { AuthGuard } from '../auth.guard';
import { Router } from '@angular/router';
import { User } from '../user';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
orders:Orders[]=[]
user:User=new User();
userid:any
ngOnInit() {


  if (!this.authGuard.isUserAuthenticated()) {
    
    this.router.navigate(['/']);
  }

  this.userid=sessionStorage.getItem('userid');
  if(this.userid){
    this.orderService.getAllOrders(Number(this.userid)).subscribe((orders: Orders[]) => {
      this.orders=orders
    });





  }
  



}
constructor(private authGuard:AuthGuard,private router:Router,private orderService:OrdersService){}

setSessionOrderId(orderNumber: any) {
  sessionStorage.setItem('OrderId', orderNumber);
  this.router.navigate(['/orderconfirm']);
}




}
