import { Component, inject, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../shared/interfaces/ibrand';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {

  private readonly brandsService = inject(BrandsService);

  brands:IBrand[] = [];

  ngOnInit(): void {
    this.getAllBrand()
  }        


  getAllBrand():void{
    this.brandsService.getAllBrands().subscribe({
      next: (res)=>{
        console.log(res);
        this.brands = res.data;
      }
    })
  }


}
