import { Component } from '@angular/core';
import { User } from '../user';
import { Orders } from '../orders';


@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent {
  user: User = new User();
  order:Orders=new Orders();
  constructor(){}
  //sessionStorage.getItem('userid');



}
