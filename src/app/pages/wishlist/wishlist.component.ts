import { Component, inject, OnInit } from '@angular/core';
import { WishListService } from '../../core/services/wishList/wish-list.service';
import { IWishlist } from '../../shared/interfaces/iwishlist';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {

  private readonly wishListService = inject(WishListService)
  private readonly cartService = inject(CartService)
  private readonly toastrService = inject(ToastrService)


  cartSub!:Subscription;
  wishList:IWishlist[] = [];
  
  ngOnInit(): void {
    this.getWishlist()
  }
  

  getWishlist():void{
    this.wishListService.getUserWishList().subscribe({
      next: (res)=>{
        console.log(res.data);
        this.wishList = res.data
      }
    })
  }
  removeItem(id:string):void{
    this.wishListService.removeFromWishList(id).subscribe({
      next:(res)=>{
        console.log(res);
        this.getWishlist()
      }
  })
  }
  addToCart(id:string):void{
    this.cartSub = this.cartService.addProductToCart(id).subscribe({
      next: (res)=>{
        console.log(res);
        if(res.status === 'success'){
          this.toastrService.success(res.message)
          this.cartService.cartNumber.next(res.numOfCartItems)
         }
      },
      error: (err)=>{
        console.log(err);
        
      }
    })
  }


}
