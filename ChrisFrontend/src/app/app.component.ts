import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentRoute!: string;
  hideHeaderRoutes: string[] = ['/checkout', '/shipping', '/cart', '/payment','/search','/orderconfirm'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  shouldHideHeader(): boolean {
    return this.hideHeaderRoutes.includes(this.currentRoute);
  }
}
