import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { User } from './user';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private baseUrl = 'http://localhost:8080';
  user:User=new User();
  users:any
 
  constructor(private http:HttpClient) { }

  
  getUserById(userid:any): Observable<any>{


    return this.http.get(`${this.baseUrl}` + '/api/user/findBy/'+`${userid}`);  

    
  }
  getUserByName(Username:any): Observable<any> {

    return this.http.get(`${this.baseUrl}` + '/api/user/findBy/user/'+`${Username}`);  

  }

  getUserByEmail(Email:any): Observable<any> {

    return this.http.get(`${this.baseUrl}` + '/api/user/findBy/email/'+`${Email}`);  

  }

  checkUsernameAvailability(username: string): Observable<boolean> {
    return this.getUserByName(username)
      .pipe(
        map((user) => {
          // If a user is returned, it means the username is already taken
          return !user; // Return true if the user is null (username is available)
        }),
        catchError(() => {
          // Handle any errors that occur during the API call
          return of(false); // Return false to indicate username is not available
        })
      );
  }
  
  checkEmailAvailability(email: string): Observable<boolean> {
    return this.getUserByEmail(email)
      .pipe(
        map((user) => {
          // If a user is returned, it means the email is already taken
          return !user; // Return true if the user is null (email is available)
        }),
        catchError(() => {
          // Handle any errors that occur during the API call
          return of(false); // Return false to indicate email is not available
        })
      );
  }
  registerUser(user: User): Observable<User> {
    
    return this.http.post<User>(`${this.baseUrl}`+'/api/user/register', user);

  }
  
  loginByUsername(loginRequest: any): Observable<any> {
    
    return this.http.post(`${this.baseUrl}`+'/api/user/login', loginRequest, httpOptions);
  }

  loginByEmail(loginRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`+'/api/user/login/email', loginRequest, httpOptions);
  }



}
