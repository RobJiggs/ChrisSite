import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from './address';
import { Observable } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})

export class AddressService {
  addys: Address[] = [];
  private baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) { }
 
  

  getAddresses(useriD: number): Observable<Address[]> {
    const url = `${this.baseUrl}/api/user/addressinfo/${useriD}`;
    return this.http.get<Address[]>(url);
  }
  getMainAddress(useriD: number): Observable<Address> {
    const url = `${this.baseUrl}/api/user/addressinfo/main/${useriD}`;
    return this.http.get<Address>(url);
  }

  addAddress(address: string): Observable<any> {
    const url = `${this.baseUrl}/api/user/add/address`;
    console.log(url)
    return this.http.post(url, address);
  }
  changeAddresses(addys: Address[]): Observable<Address[]> {
    const url = `${this.baseUrl}/api/user/change/addresses`;
    return this.http.put<Address[]>(url, addys);
  }
  changeAddress(address:Address):Observable<any>{
    const url = `${this.baseUrl}/api/user/change/address`;
    
    return this.http.put(url, address);
  }



  }


