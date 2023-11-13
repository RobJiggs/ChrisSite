import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from './order-item';
import { Items } from './items';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {

  private baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) { }

  getUserOrders(orderId: number): Observable<OrderItem[]> {
    const url = `${this.baseUrl}/api/user/orders/${orderId}`;
    return this.http.get<OrderItem[]>(url);
  }

  getItemInfo(orderitemID:number):Observable<Items>{
    console.log(orderitemID)
    const url = `${this.baseUrl}/api/user/items/orders/info/${orderitemID}`;
    console.log(url)
    return this.http.get<Items>(url);


  }





}
