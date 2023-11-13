export class Orders {

    orderNumber: any;
    dateOfOrder: any;
    status?: Status;
    statusMessage: any;
    totalPrice: any;
    phoneNumber: any;
    addressDetails: any;
    shipto:any;

   
}
enum Status {
    CONFIRMED = "CONFIRMED",
    PROCESSED = "PROCESSED",
    INTRANSIT = "INTRANSIT",
    DELIVERED = "DELIVERED",
  }