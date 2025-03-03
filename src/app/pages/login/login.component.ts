import { Component, inject, Inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy{

  loginSub!:Subscription;
  
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  msgError:string = ''
  isLoding:boolean = false;
  isSuccess:string = '';
  loginForm:FormGroup = new FormGroup(
    {
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)]),      
    })
  submitForm():void{
    if (this.loginForm.valid){
      this.isLoding = true;
      console.log(this.loginForm.value);
      console.log(this.loginForm);
     this.loginSub = this.authService.sendLoginForm(this.loginForm.value).subscribe({
        next: (res)=>{
          console.log(res);
          if (res.message === 'success'){

            setTimeout(() => {
              
              localStorage.setItem('userToken', res.token); 
              this.authService.saveUserData()
              this.router.navigate(["/home"])
            }, 5000);
            this.isSuccess = res.message
            
          }
          this.isLoding = false;
        },
        error: (err:HttpErrorResponse)=>{
          console.log(err);
          this.msgError = err.error.message;
          this.isLoding = false;
        }
      })
    }else{
      this.loginForm.markAllAsTouched( )
    }
    
  }
  ngOnDestroy(): void {
    this.loginSub?.unsubscribe()
  }


}
