import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ProductsService } from '../../core/services/products/products.service';
import { Subscription } from 'rxjs';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { WishListService } from '../../core/services/wishList/wish-list.service';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  imports: [FormsModule, SearchPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {

  search:string = "";
  products:IProduct[] = [];
  productSub!:Subscription;
  cartSub!:Subscription;
  wishListSub!:Subscription;
  private readonly productsService  = inject(ProductsService);
  private readonly wishListService = inject(WishListService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  ngOnInit(): void {
    this.getProductsData()
  }


  getProductsData():void{
    this.productSub = this.productsService.getAllProducts().subscribe({
       next: (res)=>{
         console.log(res.data);
         this.products = res.data;
       },
       error: (err)=>{
         console.log(err);
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

  addToWish(wishlist:HTMLElement,id:string):void{
     this.wishListSub =  this.wishListService.addToWishList(id).subscribe({
      next:(res)=>{
        console.log(res);
        wishlist.classList.add('active')
      }
    })
  }


  ngOnDestroy(): void {
    this.productSub?.unsubscribe()
    this.cartSub?.unsubscribe()
    this.wishListSub.unsubscribe()
  }

}
