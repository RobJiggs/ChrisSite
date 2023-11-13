import { Component } from '@angular/core';
import { AuthGuard } from '../auth.guard';
import { User } from '../user';
import { UserService } from '../user.service';
import { AddressService } from '../address.service';
import { Address } from '../address';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addressinfo',
  templateUrl: './addressinfo.component.html',
  styleUrls: ['./addressinfo.component.css']
})
export class AddressinfoComponent {
  public isLoggedIn = false;
  public accountInfo: any;
  public id: any;
  showSecondaryAddress = false;
  editAddress=true;
  user: User = new User();
  addys: Address[] = [];
  addressChange: Address[] = [];
  newAddress: Address = new Address(); // Add this line
  secondaryAddress: Address = new Address();
  constructor(private router: Router,private authGuard: AuthGuard, private authService: UserService, private addyService: AddressService) {}

  ngOnInit() {
    this.isLoggedIn = this.authGuard.isUserAuthenticated();
    if (!this.authGuard.isUserAuthenticated()) {
      // User is signed in, redirect to /accountinfo
      this.router.navigate(['/account']);
    }
   
    if (this.isLoggedIn) {
      
      this.id = sessionStorage.getItem('userid');
      this.loadAccountInfo();
      this.addyService.getAddresses(this.id).subscribe(data => {
        this.addys = data;
  
        // Find the address with status "MAIN"
        this.newAddress = this.addys.find(address => address.status === 'MAIN') || new Address();
  
        // Find the address with status "SECONDARY"
        this.secondaryAddress = this.addys.find(address => address.status === 'SECONDARY') || new Address();
      }); this.addyService.getAddresses(this.id).subscribe(data => {
        this.addys = data;
      });
    }
  }
  toggleAddressEdit(){

    this.editAddress=!this.editAddress;



  }



  loadAccountInfo() {
    this.authService.getUserById(this.id).subscribe(data => {
      this.user = data;
    });
  }


  createAddress(){
    this.newAddress.status='MAIN'
    this.newAddress.user_id=this.id
    
    const addjson = JSON.stringify(this.newAddress);
  this.addyService.addAddress(addjson).subscribe(() => {
  this.addyService.getAddresses(this.id).subscribe(data => {
    this.addys = data;
  });
});



  

  }
  createSecondary(){
    this.secondaryAddress.status='SECONDARY'
    this.secondaryAddress.user_id=this.id;
    const addjson = JSON.stringify(this.secondaryAddress);
    this.addyService.addAddress(addjson).subscribe(() => {
    this.addyService.getAddresses(this.id).subscribe(data => {
      this.addys = data;
    });
  });
  this.showSecondaryAddress = false;


  }



  saveAddress(address: Address) {
    if (address.status === 'MAIN') {
      // Update the main address
      this.addyService.changeAddress(address).subscribe(() => {
        console.log('Main address saved successfully.');
      });
    } else {
      // Update the secondary address
      this.addyService.changeAddress(address).subscribe(() => {
        console.log('Secondary address saved successfully.');
      });
    }
    this.addyService.getAddresses(this.id).subscribe(data => {
      this.addys = data;
    });
    




  }


  saveAddresses() {
    console.log("addresses");
    this.addys.forEach((address, index) => {
      if (address.status === 'MAIN') {
        // Update the main address
        this.addyService.changeAddress(address).subscribe(() => {
          console.log('Main address saved successfully.');
          if (index === this.addys.length - 1) {
            this.retrieveAddresses();
          }
        });
      } else {
        // Update the secondary address
        this.addyService.changeAddress(address).subscribe(() => {
          console.log('Secondary address saved successfully.');
          if (index === this.addys.length - 1) {
            this.retrieveAddresses();
          }
        });
      }
    });

    this.toggleAddressEdit();

  }
  
  retrieveAddresses() {
    this.addyService.getAddresses(this.id).subscribe(data => {
      this.addys = data;
    });
  }
  
  
  
  
  
  
  
  

  
}
