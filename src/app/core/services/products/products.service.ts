import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api_url } from '../../custom_injectable/api_url';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor( private httpClient:HttpClient, @Inject(api_url) private apipath:string) { }

  getAllProducts():Observable<any>{
    return this.httpClient.get(this.apipath + "/products")
  }
  getSpecificProduct(id:string | null):Observable<any>{
    return this.httpClient.get(this.apipath + `/products/${id}`)
  }

}
