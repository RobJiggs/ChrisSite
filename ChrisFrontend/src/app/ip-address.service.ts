import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IpAddressService {

  constructor(private http: HttpClient) { }

  getIpAddress(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Use a third-party service or API to get the IP address
      this.http.get('https://api.ipify.org?format=json')
        .subscribe((response: any) => {
          const ipAddress = response.ip;
          resolve(ipAddress);
        }, (error) => {
          console.error('Error retrieving IP address:', error);
          reject(error);
        });
    });
  }
}
