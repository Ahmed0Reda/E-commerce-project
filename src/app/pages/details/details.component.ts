import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy{

  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly productsService = inject(ProductsService)

  detailsProduct: IProduct | null = null;

  detailsSub!:Subscription;
  
  ngOnInit(): void {
    this.detailsSub = this.activatedRoute.paramMap.subscribe({
      next: (p)=>{
        console.log(p.get('id'));
        let idProduct = p.get('id');
        this.productsService.getSpecificProduct(idProduct).subscribe({
          next: (res)=>{
            console.log(res.data);
            this.detailsProduct = res.data
          },
          error: (err)=>{
            console.log(err);
          }
        })
      }
    })
  }
  ngOnDestroy(): void {
    this.detailsSub?.unsubscribe()
  }

}
