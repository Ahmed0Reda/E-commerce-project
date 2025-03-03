import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../core/services/orders/orders.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';


@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  
  private readonly formbuilder = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly ordersService = inject(OrdersService)
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);




  checkOutForm!:FormGroup;
  cartId:string = '';
  cartIdSub!:Subscription;
  checkOutSub!:Subscription;
  cashSub!:Subscription;


  ngOnInit(): void {
    this.inintForm();
    this.getCartId()
    
  }
  inintForm():void{
    this.checkOutForm = this.formbuilder.group({
      details: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city:[null, [Validators.required]]

    })
  }
  getCartId():void{
   this.cartIdSub = this.activatedRoute.paramMap.subscribe({
      next:(param)=>{
        console.log(param.get('id'));
        this.cartId = param.get('id')!;  
      }
    })
  }

  submitForm():void{
    console.log(this.checkOutForm.value);
    this.checkOutSub = this.ordersService.checkOutPayment(this.cartId, this.checkOutForm.value).subscribe({
      next:(res)=>{
        console.log(res);
        if (res.status === 'success') {
          open(res.session.url, '_self')
        }
      },
      error:(err)=>{
        console.log(err);
      }
    })

    
    
  }

  cashPayment():void{
    this.cashSub = this.ordersService.CashOutPayment(this.cartId, this.checkOutForm.value).subscribe({
      next:(res)=>{
        console.log(res);
        if(res.status === 'success'){
          this.toastrService.success('Order has been Accepted')
          this.router.navigate(['/home'])
          this.cartService.cartNumber.next(0)

         }
      }
    })
  }
  ngOnDestroy(): void {
    this.checkOutSub?.unsubscribe()
    this.cartIdSub?.unsubscribe()
    this.cashSub?.unsubscribe()
  }

}
