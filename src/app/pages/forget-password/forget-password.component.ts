import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { emit } from 'process';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {

  private readonly formBuilder = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  step:number = 1;

  verifyEmail:FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]]
  })

  verifyCode:FormGroup = this.formBuilder.group({
    resetCode: [null, [Validators.required, Validators.pattern(/^\w{6}$/)]]
  })

  resetPassword:FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    newPassword: [null, [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)]],      

  })
  

  verifyEmailSubmit():void{

    let emailValue =  this.verifyEmail.get('email')?.value
    this.resetPassword.get('email')?.patchValue(emailValue)

    this.authService.setEmailVerify(this.verifyEmail.value).subscribe({
      next: (res)=>{
        console.log(res);
        if(res.statusMsg === 'success'){
          this.step =2;
        }
        
      },
      error: (err)=>{
        console.log(err);
        
      }
    })
  }

  verifyCodeSubmit():void{
    this.authService.setCodeVerify(this.verifyCode.value).subscribe({
      next: (res)=>{
        console.log(res);
        if(res.status === 'Success'){
          this.step =3;
        }
        
      },
      error: (err)=>{
        console.log(err);
        
      }
    })
  }

  resetPasswordSubmit():void{
    this.authService.setResetPassword(this.resetPassword.value).subscribe({
      next: (res)=>{
        console.log(res);
        localStorage.setItem("userToken", res.token)
        this.authService.saveUserData()
        this.router.navigate(['/home'])
      },
      error: (err)=>{
        console.log(err);
        
      }
    })
  }
}
