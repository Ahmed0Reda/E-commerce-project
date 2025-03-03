import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { api_url } from '../../custom_injectable/api_url';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpClient:HttpClient, @Inject(api_url) private apipath:string) { }

  cartNumber:BehaviorSubject<number> = new BehaviorSubject(0);

  addProductToCart(id:string):Observable<any>{
    return this.httpClient.post(this.apipath + "/cart", {
      "productId": id
  } )
  }

  getLoggedUserCart():Observable<any>{
    return this.httpClient.get(this.apipath + '/cart')
  }

  removeSpecificItem(id:string):Observable<any>{
   return this.httpClient.delete(this.apipath + `/cart/${id}`)
  }

  updateCartQuantity(id:string, newCount:number):Observable<any>{
    return this.httpClient.put(this.apipath + `/cart/${id}`, 
      {
        "count": newCount
    }
)
  }

  clearCart():Observable<any>{
    return this.httpClient.delete(this.apipath + '/cart')
  }
}
