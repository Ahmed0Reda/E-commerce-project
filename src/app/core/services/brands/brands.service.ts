import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api_url } from '../../custom_injectable/api_url';
@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor(private httpClinet:HttpClient, @Inject(api_url) private apipath:string ) { }


  getAllBrands():Observable<any>{
    return this.httpClinet.get(this.apipath + `/brands`)
  }
  getSpecificBrand(id:string):Observable<any>{
    return this.httpClinet.get(this.apipath + `brands/${id}`)
  }

}
