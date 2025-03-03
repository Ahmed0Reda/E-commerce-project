import { Component, inject, Inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formbuilder = inject(FormBuilder)

  registerSub!:Subscription;

  msgError:string = ''
  isLoding:boolean = false;
  isSuccess:string = '';
  registerForm:FormGroup = this.formbuilder.group({
    name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)] ],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)]],
    rePassword: [null, [Validators.required]],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
  }, {validators: this.confirmPassword})


  // Not the best in performance 
  // registerForm:FormGroup = new FormGroup(
  //   {
  //     name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)] ),
  //     email: new FormControl(null, [Validators.required, Validators.email]),
  //     password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)]),
  //     rePassword: new FormControl(null, [Validators.required]),
  //     phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
      
      
  //   }, {validators: this.confirmPassword})
  submitForm():void{
    if (this.registerForm.valid){
      this.isLoding = true;
      console.log(this.registerForm.value);
      console.log(this.registerForm);
      this.registerSub = this.authService.sendRegisterForm(this.registerForm.value).subscribe({
        next: (res)=>{
          console.log(res);
          if (res.message === 'success'){

            setTimeout(() => {
              
              this.router.navigate(["/login"])
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
      this.registerForm.markAllAsTouched( )
    }
    
  }
  confirmPassword( group: AbstractControl): { missmatch: boolean; } | null{
    return group.get('password')?.value === group.get('rePassword')?.value ? null : {missmatch:true}
  }
  ngOnDestroy(): void {
    this.registerSub?.unsubscribe()
  }

}
