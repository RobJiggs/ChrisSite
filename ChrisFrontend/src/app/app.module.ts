import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ItemsServicesComponent } from './items-services/items-services.component';
import { MaleClothingComponent } from './male-clothing/male-clothing.component';
import { FemaleClothingComponent } from './female-clothing/female-clothing.component';
import { AccountServicesComponent } from './account-services/account-services.component';
import { AddressinfoComponent } from './addressinfo/addressinfo.component';
import { CartInfoComponent } from './cart-info/cart-info.component';
import { CartmenuService } from './cartmenu.service';
import { OutsideClickDirective } from './outside-click.directive';
import { CheckoutComponent } from './checkout/checkout.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { PaymentComponent } from './payment/payment.component';
import { OtherheaderComponent } from './otherheader/otherheader.component';
import { SearchPageComponent } from './search-page/search-page.component';
import {MatSliderModule} from '@angular/material/slider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { NgxPayPalModule } from 'ngx-paypal';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { OrdersComponent } from './orders/orders.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { ItemdetailsComponent } from './itemdetails/itemdetails.component';
import { CsvItemAddComponent } from './csv-item-add/csv-item-add.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ItemsServicesComponent,
    MaleClothingComponent,
    FemaleClothingComponent,
    AccountServicesComponent,
    AddressinfoComponent,
    CartInfoComponent,
    OutsideClickDirective,
    CheckoutComponent,
    ShipmentComponent,
    PaymentComponent,
    OtherheaderComponent,
    SearchPageComponent,
    OrderConfirmationComponent,
    OrdersComponent,
    ForgotpasswordComponent,
    ResetPasswordComponent,
    AccountInfoComponent,
    ItemdetailsComponent,
    CsvItemAddComponent,
    ForbiddenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSliderModule,
    NgxPayPalModule,
    MatBadgeModule,
    MatIconModule,
    
  ],
  providers: [CartmenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }
