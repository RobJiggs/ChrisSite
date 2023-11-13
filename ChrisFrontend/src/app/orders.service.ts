import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders } from './orders';
import { OrderItem } from './order-item';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl = 'http://localhost:8080/';
  private Url!: string;

  constructor(private http: HttpClient){}




  public addOrderItems(cartDetails: any): Observable<Orders> {
    this.Url = this.baseUrl+ 'api/user/create/order'; // Specify the API endpoint
  
    // Make the HTTP POST request
    return this.http.post<Orders>(this.Url, cartDetails);
  }


  getOrder(orderId: number): Observable<Orders> {
    const url = `${this.baseUrl}api/user/order/${orderId}`;
    console.log(url)
    return this.http.get<Orders>(url);
  }

  getOrderItems(orderId: number): Observable<OrderItem[]> {
    const url = `${this.baseUrl}api/user/orderitems/${orderId}`;
    return this.http.get<OrderItem[]>(url);
  }


  getAllOrders(UserId:number):Observable<Orders[]>{

    const url =   `${this.baseUrl}api/user/orders/{customerid}`;
    return this.http.get<Orders[]>(url);
  }


}
