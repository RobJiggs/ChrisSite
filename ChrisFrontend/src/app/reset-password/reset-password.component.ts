import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IpAddressService } from '../ip-address.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token!: string;
  newPassword!: string;
  resetSuccess: boolean = false;
  resetError: boolean = false;
  private baseUrl = 'http://localhost:8080';
  ipAddress!: string;
  constructor(private route: ActivatedRoute, private http: HttpClient,private router:Router,private ipAddressService: IpAddressService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'];
    });



    this.ipAddressService.getIpAddress()
    .then((ipAddress: string) => {
      this.ipAddress = ipAddress;
      sessionStorage.setItem('ip',this.ipAddress)
      console.log(sessionStorage.getItem('ip'))
    })
    .catch((error: any) => {
      console.error('Error retrieving IP address:', error);
    });
  
  }
  

  resetPassword() {
    const request = { token: this.token, newPassword: this.newPassword };
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json' // Include the Accept header
    };

    this.http.post(this.baseUrl + '/api/user/reset-password', request, { headers: headers })
      .subscribe(
        () => {
          this.resetSuccess = true;
          this.resetError = false;
          this.router.navigate(['/account']);
        },
        (error) => {
          this.resetSuccess = false;
          this.resetError = true;
          console.log(error);
        }
      );
}

  
  
  
  
  
  
  
  
}
