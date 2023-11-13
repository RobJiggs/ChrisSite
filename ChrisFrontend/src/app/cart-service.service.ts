import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from './cart';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { IpAddressService } from './ip-address.service';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  private baseUrl = 'http://localhost:8080';
  private Url!: string;
  private body="";
  private ipAddress="";
  
  constructor(private http: HttpClient,private ipAddressService: IpAddressService) { }
  
  ngOnInit() {
  
    this.createCartIfUserIdExists();
    
  }
  
  createCartIfUserIdExists(): Observable<Cart> {
    const userId = sessionStorage.getItem('userid');
    this.ipAddressService.getIpAddress()
    .then((ipAddress: string) => {
      this.ipAddress = ipAddress;
       
      sessionStorage.setItem('ip',ipAddress)
      
     
      
    })
    .catch((error: any) => {
      console.error('Error retrieving IP address:', error);
    });

  




    
    if (userId) {
      console.log("this here is the issue my g")
      this.Url = this.baseUrl + '/api/user/create/cart/' + userId;
      sessionStorage.removeItem('ip')
    } else {
      this.Url = this.baseUrl + '/api/user/create/cart/guest';
      
      const sessionvalue=sessionStorage.getItem('ip');
      if (sessionvalue !== null) {
        this.body = sessionvalue;
      } else {
        // Handle the case when the value is null, e.g., provide a default value or perform some other action.
        // For example:
        this.body = 'Default Value';
      }
      console.log()
      console.log(this.body)
    }
    

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Cart>(this.Url, this.body);
  }
  




}
