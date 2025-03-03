import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {

  private readonly cartService = inject(CartService);
  cartDetails:ICart = {} as ICart;

  cartDataSub!:Subscription;
  removeItemSub!:Subscription;
  updateDataSub!:Subscription;
  clearDataSub!:Subscription;

  ngOnInit(): void {
    this.getCartData()
  }

  getCartData():void{
   this.cartDataSub =  this.cartService.getLoggedUserCart().subscribe({
      next: (res)=>{
        console.log(res.data);
        this.cartDetails = res.data;
      },
      error: (err)=>{
        console.log(err);
        
      }
    })
  }

  removeItem(id:string):void{
    this.removeItemSub = this.cartService.removeSpecificItem(id).subscribe({
      next:(res)=>{
        console.log(res);
        this.cartDetails = res.data
        this.cartService.cartNumber.next(res.numOfCartItems)
      },
    error:(err)=>{
      console.log(err);
    }
  })
  }

  updateCount(id:string, newCount:number):void{
    this.updateDataSub = this.cartService.updateCartQuantity(id, newCount).subscribe({
      next:(res)=>{
        console.log(res);
        this.cartDetails = res.data;
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  clearItems():void{
    this.clearDataSub = this.cartService.clearCart().subscribe({
      next:(res)=>{
        console.log(res);
        if(res.message === 'success'){
          this.cartDetails = {} as ICart;
          this.cartService.cartNumber.next(0)

        }
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  ngOnDestroy(): void {
    this.cartDataSub?.unsubscribe()
    this.removeItemSub?.unsubscribe()
    this.updateDataSub?.unsubscribe()
    this.clearDataSub?.unsubscribe()
  }


}
