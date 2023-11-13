import { Component,OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthGuard } from '../auth.guard';
import { HeaderComponent } from '../header/header.component';
import { CartServiceService } from '../cart-service.service';
import { Cart } from '../cart';
import { CartBadgeService } from '../cart-badge.service';
import { CartItem } from '../cart-item';
import { CartItemService } from '../cart-item-service.service';
@Component({
  selector: 'app-account-services',
  templateUrl: './account-services.component.html',
  styleUrls: ['./account-services.component.css']
})
export class AccountServicesComponent implements OnInit {
 public isLoggedIn=false
 cart:Cart=new Cart();

  ngOnInit(): void {
    this.isLoggedIn = this.authGuard.isUserAuthenticated();
    console.log(this.isLoggedIn)
    if (this.authGuard.isUserAuthenticated()) {
      // User is signed in, redirect to /accountinfo
      this.router.navigate(['/addressinfo']);
    }

    this.cartitemService.getUserCart(Number(sessionStorage.getItem('cartID'))).subscribe(
      (cartItems: CartItem[]) => {
        
        let total=0;
        for (const cartItem of cartItems) {
          total += cartItem.quantity;
        }
        
        
        this.cartBadgeService.updateCartItemCount(total);
        
      },
      (error: any) => {
        console.log(error);
      }
    );


  }
  


  constructor(
    private authGuard:AuthGuard,
    private router: Router,
    private signupService: UserService
    ,private cartService:CartServiceService,
    private cartitemService:CartItemService
    ,
    private cartBadgeService: CartBadgeService
  ) {}
  
  user:User= new User();
  Users: any;


  loginMode = true;
  createAccountMode = false;

  username!: string;
  email!: string;
  password!: string;
  emailpassword!: string;
  firstName!: string;
  lastName!: string;
  confirmPassword: string | undefined;
  errorMessage: string = '';
  ack:string='';
  
  toggleLogin() {
    this.loginMode = true;
    this.createAccountMode = false;
  }

  toggleCreateAccount() {
    this.loginMode = false;
    this.createAccountMode = true;
    
    
  }


  clearEmailAndPassword() {
    this.email = '';
    this.emailpassword = '';
  }

  clearUsernameAndPassword() {
    this.username = '';
    this.password = '';
  }

  submitLoginForm() {
      this.errorMessage=''
      this.ack=''
    
      if (this.username && this.password) {
        const loginRequest = {
          username: this.username,
          password: this.password,
       };   
        
        this.signupService.loginByUsername(loginRequest).subscribe(
          (response: any) => {
            // Login successful
            console.log('Login successful');
            this.ack = "Login successful"; 
          
            // You can perform any additional actions or redirect to a different page
            this.signupService.getUserByName(this.username).subscribe(data => {
              this.user = data;
              sessionStorage.setItem('userid', this.user.userID);
              console.log(sessionStorage.getItem('userid'));
              sessionStorage.setItem('Username', this.user.userName);

            });
            this.authGuard.updateLoginStatus(true);
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.removeItem('cartID');
            localStorage.removeItem('shippingDetails');
            console.log(sessionStorage.getItem('cartID')+"after login")
            this.router.navigate(['/accountinfo']);
            this.cartService.createCartIfUserIdExists().subscribe(
              (data) => {
               
                this.cart = data;
                sessionStorage.setItem('cartID',this.cart.cartID)
                console.log(sessionStorage.getItem('cartID')+"new cart")
              },
              (error: any) => {
                console.log(error);
              }
            );

          },
          (error: any) => {
            // Error occurred during login
            console.log('Invalid username or password');
            console.log('Error:', error);
            // Display an error message or take appropriate action based on your application's needs
            this.errorMessage = 'Invalid username or password';
          }
        );
      } else if (this.email && this.emailpassword) {
        const loginRequest = {
          email: this.email,
          password: this.emailpassword
        };
    
        this.signupService.loginByEmail(loginRequest).subscribe(
          (response: any) => {
            // Login successful
            console.log('Login successful');
            this.ack = "Login successful";  
            // You can perform any additional actions or redirect to a different page
           this.signupService.getUserByEmail(this.email).subscribe(data => {
              this.user = data;
              sessionStorage.setItem('userid', this.user.userID);
              console.log(sessionStorage.getItem('userid'));
              sessionStorage.setItem('Username', this.user.userName);

            });
            this.authGuard.updateLoginStatus(true);
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.removeItem('cartID');
            localStorage.removeItem('shippingDetails');
            this.router.navigate(['/accountinfo']);
            this.cartService.createCartIfUserIdExists().subscribe(
              (data) => {
               
                this.cart = data;
                sessionStorage.setItem('cartID',this.cart.cartID)
              },
              (error: any) => {
                console.log(error);
              }
            );
          },
          (error: any) => {
            // Error occurred during login
            console.log('Invalid email or password');
            console.log('Error:', error);
            // Display an error message or take appropriate action based on your application's needs
            this.errorMessage = 'Invalid email or password';
          }
        );
      } else {
        // Invalid form data, display an error message or take appropriate action
        console.log('Invalid form data');
      }
    
    


    
  }


  registerSubmitForm() {
    if (this.password === this.confirmPassword) {
      // Passwords match, proceed with form submission or further processing
      if (this.validateEmail(this.email)) {
        // Passwords match and email is valid, proceed with form submission or further processing
        this.checkEmailAvailability(this.email)
      } else {
        // Invalid email format, handle the error or show an error message
        console.log('Invalid email format!');
        this.errorMessage = 'Invalid email format!';
      }
      
      
      
    } else {
      // Passwords do not match, handle the error or show an error message
      console.log('Password and Confirm Password do not match!');
      this.errorMessage = 'Password and Confirm Password do not match!';
      // You can display an error message or take appropriate action based on your application's needs
    }
  }

  checkEmailAvailability(email: string) {
    this.signupService.checkEmailAvailability(email)
      .subscribe((isEmailAvailable: boolean) => {
        if (isEmailAvailable) {
          // Email is available, proceed with registration
          console.log('Email is available');
          this.checkUserAvailability(this.username)
        } else {
          // Email is already taken, display error message or take appropriate action
          console.log('Email is already taken');
          this.errorMessage = 'Email is already taken';
        }
      });
  }

  checkUserAvailability(username: string) {
    this.signupService.checkUsernameAvailability(username)
      .subscribe((isUserAvailable: boolean) => {
        if (isUserAvailable) {
          // Email is available, proceed with registration
          console.log('Username is available');
          
          this.user = new User();
          this.user.userName=this.username
          this.user.firstName=this.firstName
          this.user.lastName=this.lastName
          this.user.email=this.email
          this.user.passWord=this.password

          
          this.signupService.registerUser(this.user)
          .subscribe((response: User) => {
            // Registration successful, perform any necessary actions (e.g., navigate to another page)
            console.log('Registration successful', response);
            // Reset the form or clear the input fields
            this.username=''
          this.firstName=''
          this.password=''
          this.confirmPassword=''
          this.lastName=''
          this.email=''
          this.errorMessage=''
          this.toggleLogin()
          this.ack = "Registration successful";  
            
          }, (error: any) => {
            // Handle registration error, display error message or take appropriate action
            console.log('Registration failed', error);
            this.errorMessage = 'Registration failed. Please try again later.';
          });



        } else {
          // Email is already taken, display error message or take appropriate action
          console.log('Username is already taken');
          this.errorMessage = 'Username is already taken';
        }
      });
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }




}


