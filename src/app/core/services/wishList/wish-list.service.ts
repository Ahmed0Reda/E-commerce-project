import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { api_url } from '../../custom_injectable/api_url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishListService {

constructor( private httpClient:HttpClient, @Inject(api_url) private apipath:string  ) {}


addToWishList(id:string):Observable<any>{
  return this.httpClient.post(this.apipath + `/wishlist`, 
    {
      "productId": id
  }
  )
}

removeFromWishList(id:string):Observable<any>{
  return this.httpClient.delete(this.apipath + `/wishlist/${id}`)
}

getUserWishList():Observable<any>{
  return this.httpClient.get(this.apipath +'/wishlist')
}


}
