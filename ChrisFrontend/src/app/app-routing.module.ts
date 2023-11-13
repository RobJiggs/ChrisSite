import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ItemsServicesComponent } from './items-services/items-services.component';
import { MaleClothingComponent } from './male-clothing/male-clothing.component';
import { FemaleClothingComponent } from './female-clothing/female-clothing.component';
import { AccountServicesComponent } from './account-services/account-services.component';
import { AddressinfoComponent } from './addressinfo/addressinfo.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { CartInfoComponent } from './cart-info/cart-info.component';
import { PaymentComponent } from './payment/payment.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { OrdersComponent } from './orders/orders.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ItemdetailsComponent } from './itemdetails/itemdetails.component';
import { CsvItemAddComponent } from './csv-item-add/csv-item-add.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

const routes: Routes = [{ path: '', component: ItemsServicesComponent },
{path:'home', component:HomeComponent},
{path:'womens', component:FemaleClothingComponent},
{path:'mens', component:MaleClothingComponent},
{path:'account',component:AccountServicesComponent},
{path:'addressinfo',component:AddressinfoComponent},
{path:'checkout',component:CheckoutComponent},
{path:'shipping',component:ShipmentComponent},
{path:'cart',component:CartInfoComponent},
{path:'payment',component:PaymentComponent},
{path:'search',component:SearchPageComponent},
{path:'orderconfirm/:onumber',component:OrderConfirmationComponent},
{ path: 'reset-password/:token', component: ResetPasswordComponent },
{path:'forgot-password',component:ForgotpasswordComponent},
{ path: 'orders', component: OrdersComponent },
{ path: 'accountinfo', component: AccountInfoComponent },
{path:'items/:name',component:ItemdetailsComponent},
{path:'massadd',component:CsvItemAddComponent},
{path:'403',component:ForbiddenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
