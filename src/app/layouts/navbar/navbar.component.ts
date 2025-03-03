import { AuthService } from './../../core/services/auth/auth.service';
import { authGuard } from './../../core/guards/auth.guard';
import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../core/services/myTranslate/my-translate.service';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isLogin = input<boolean>(true);
  countCart!:number ;

  ngOnInit(): void {
    this.cartService.cartNumber.subscribe({
      next: (value)=>{
        console.log(value);
        this.countCart = value
      }
    })
    this.cartService.getLoggedUserCart().subscribe({
      next:(res)=>{
        this.cartService.cartNumber.next(res.numOfCartItems)
      }
    })
  }
  readonly authService = inject(AuthService)
  readonly myTranslateService = inject(MyTranslateService)
  readonly translateService = inject(TranslateService)
  readonly cartService = inject(CartService)

  change(lang:string):void{
    this.myTranslateService.changeLangTranslate(lang)
  }
  currentLang(lang:string):boolean{
    return   this.translateService.currentLang === lang
  }
}
