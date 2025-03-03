import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api_url } from '../../custom_injectable/api_url';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {


  constructor(private httpClient:HttpClient, @Inject(api_url) private apipath:string) { }

  checkOutPayment(id:string, data:object):Observable<any>{
    return this.httpClient.post(this.apipath + `/orders/checkout-session/${id}?url=http://localhost:4200`, 
      {
        "shippingAddress": data
    }
    )
  }

  CashOutPayment(id:string, data:object):Observable<any>{
    return this.httpClient.post(this.apipath + `/orders/${id}`, 
      {
        "shippingAddress": data
    }
    )
  }

}
