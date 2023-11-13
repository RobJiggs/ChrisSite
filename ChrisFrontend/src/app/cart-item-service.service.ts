import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart-item';
import { Items } from './items';

@Injectable({
  providedIn: 'root'
})
export class CartItemService {
 

  private baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) { }

  getUserCart(cartId: number): Observable<CartItem[]> {
    const url = `${this.baseUrl}/api/user/cart/${cartId}`;
    return this.http.get<CartItem[]>(url);
  }


  getItemInfo(cartitemID:number):Observable<Items>{
    
    const url = `${this.baseUrl}/api/user/items/cart/info/${cartitemID}`;
    return this.http.get<Items>(url);


  }

  deleteCartItem(cartItemId: number): Observable<void> {
    const url = `${this.baseUrl}/api/user/cartitem/delete/${cartItemId}`;
    return this.http.delete<void>(url);
  }

  updateCartItemQuantity(cartItemId: number, quantity: number): Observable<CartItem> {
    const url = `${this.baseUrl}/api/user/cartitem/change/quantity/${cartItemId}`;
    console.log(url)
    return this.http.put<CartItem>(url, { quantity });
  }

  createCartItem(itemRequest: any): Observable<CartItem> {
    const url = `${this.baseUrl}/api/user/cartitem/add`;
    const body = {
      name: itemRequest.name,
      color: itemRequest.color,
      sex: itemRequest.sex,
      size: itemRequest.size,
      cartID: itemRequest.cartID
    };
    return this.http.post<CartItem>(url, body);
  }
  createCartItemQuantity(itemRequest: any): Observable<CartItem> {
    const url = `${this.baseUrl}/api/user/cartitem/quantity/add`;
    const body = {
      name: itemRequest.name,
      color: itemRequest.color,
      sex: itemRequest.sex,
      size: itemRequest.size,
      quantity:itemRequest.quantity,
      cartID: itemRequest.cartID
    };
    console.log(body.quantity)
    return this.http.post<CartItem>(url, body);
  }

}


