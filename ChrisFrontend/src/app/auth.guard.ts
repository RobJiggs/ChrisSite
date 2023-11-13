import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  private loginStatus = new Subject<boolean>();
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isAuthenticated = '';

    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/account']); // Modify the route to your login page
      return false;
    }
  }

  isUserAuthenticated(): boolean {
    const isAuthenticated = sessionStorage.getItem('userid');
    return isAuthenticated ? true : false;
  }


  updateLoginStatus(isLoggedIn: boolean): void {
    this.loginStatus.next(isLoggedIn);
  }

  getLoginStatus(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  


}
