import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
  resetForm: FormGroup;
  resetSuccess: boolean = false;
  resetError: boolean = false;
  private baseUrl = 'http://localhost:8080';
  
  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    const email = this.resetForm.get('email')?.value;
    

    const resetData = { email};

    this.http.post(this.baseUrl+'/api/user/forgot-password', resetData)
      .subscribe(
        () => {
          this.resetForm.reset();
          this.resetSuccess = true;
          this.resetError = false;
        },
        () => {
          this.resetSuccess = false;
          this.resetError = true;
        }
      );
  }
}





