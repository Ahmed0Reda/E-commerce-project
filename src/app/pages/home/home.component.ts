import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategories } from '../../shared/interfaces/icategories';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { WishListService } from '../../core/services/wishList/wish-list.service';

@Component({
  selector: 'app-home',
  imports: [CarouselModule, RouterLink, SearchPipe, FormsModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit , OnDestroy {
  private readonly productsService  = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishListService = inject(WishListService);


  search:string = "";

  customMainSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    autoplay:true,
    rtl:true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items:1,
    nav: true
  }

  customOptions:OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    rtl:true,
    autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  products:IProduct[] = [];
  categories:ICategories[] = [];
  productSub!:Subscription;
  categorySub!:Subscription;
  cartSub!:Subscription;
  wishListSub!:Subscription;
  removeFromWishSub!:Subscription;
  allWishsId!:string;
  ngOnInit(): void {
    this.getProductsData()
    this.getCatergoriesData()
    // this.getAllWish()
  }
  getProductsData():void{
   this.productSub = this.productsService.getAllProducts().subscribe({
      next: (res)=>{
        this.products = res.data;
      }
    })
  }
  getCatergoriesData():void{


    this.categorySub = this.categoriesService.getAllCategories().subscribe(
      {
        next:(res)=>{
          this.categories = res.data;
        }
      }
    )

  }


  addToCart(id:string):void{
    this.cartSub = this.cartService.addProductToCart(id).subscribe({
      next: (res)=>{
        if(res.status === 'success'){
          this.toastrService.success(res.message)
          this.cartService.cartNumber.next(res.numOfCartItems)
         }
      }
    })
  }

  // getAllWish():void{
  //   this.wishListService.getUserWishList().subscribe({
  //     next: (res)=>{
  //       console.log(res);
  //       this.allWishsId = res.data.id
  //     }
  //   })
  // }
  addToWish(wishlist:HTMLElement,id:string):void{
    if(wishlist.classList.contains('active')){
      this.removeFromWishSub = this.wishListService.removeFromWishList(id).subscribe({
        next: (res)=>{
          wishlist.classList.remove('active')
        }
      })
    }else{

      this.wishListSub =  this.wishListService.addToWishList(id).subscribe({
       next:(res)=>{
         wishlist.classList.add('active')
       }
     })
    }
  }


  ngOnDestroy(): void {
    this.productSub?.unsubscribe()
    this.categorySub?.unsubscribe()
    this.cartSub?.unsubscribe()
    this.wishListSub?.unsubscribe()
  }
  

}
