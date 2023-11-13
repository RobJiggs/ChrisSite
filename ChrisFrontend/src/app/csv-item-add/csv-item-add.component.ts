import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthGuard } from '../auth.guard';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';
import { ItemsService } from '../items.service';

@Component({
  selector: 'app-csv-item-add',
  templateUrl: './csv-item-add.component.html',
  styleUrls: ['./csv-item-add.component.css']
})
export class CsvItemAddComponent {
  public isLoggedIn = false;
  user:User=new User()
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  constructor(private authGuard:AuthGuard,private router:Router,private authService:UserService,private itemService:ItemsService){}

  ngOnInit() {
    this.isLoggedIn = this.authGuard.isUserAuthenticated();
    if (!this.authGuard.isUserAuthenticated()) {
      // User is signed in, redirect to /accountinfo
      this.router.navigate(['/account']);
}
    const user = sessionStorage.getItem('userid');
    if (user!=null){
      const userid=parseInt(user)
      this.authService.getUserById(userid).subscribe((data: User) => {
        this.user = data;

        if (this.user.userName !== 'Admin') {
          // User is not admin, redirect to /account
          this.router.navigate(['/403']);
        }
      });
    
    }








  }

  uploadCSVFile(event: Event): void {
    if (this.fileInput) {
      const fileInputElement = this.fileInput.nativeElement;
    
      if (fileInputElement.files && fileInputElement.files.length > 0) {
        const file = fileInputElement.files[0];
        
        this.itemService.massAddItems(file).subscribe((response) => {
          // Handle the response from the backend (e.g., success message or error)
          
        });
      } else {
        // Handle the case where no file is selected
        console.error('No file selected.');
      }
    }
  

}
}