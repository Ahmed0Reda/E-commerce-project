import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { api_url } from '../../custom_injectable/api_url';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient:HttpClient, @Inject(api_url) private apipath:string, private router:Router) { }

  userData:any = null;

  sendRegisterForm(data:object):Observable<any>{
    return this.httpClient.post (this.apipath + "/auth/signup", data)
  }

  sendLoginForm(data:object):Observable<any>{
    return this.httpClient.post (this.apipath + "/auth/signin", data)
  }


  saveUserData():void{
    if (    localStorage.getItem("userToken") !== null    ) {
       this.userData =  jwtDecode( localStorage.getItem('userToken') !)
    }
  }

  logOut():void{
    localStorage.removeItem('userToken');
    this.userData = null;
    this.router.navigate(['/login'])
  }

  setEmailVerify(data:object):Observable<any>{

    return this.httpClient.post(this.apipath + "/auth/forgotPasswords", data)
    
  }
  setCodeVerify(data:object):Observable<any>{

    return this.httpClient.post(this.apipath + "/auth/verifyResetCode", data)
    
  }


  setResetPassword(data:object):Observable<any>{

    return this.httpClient.put(this.apipath + "/auth/resetPassword", data)
    
  }

}
