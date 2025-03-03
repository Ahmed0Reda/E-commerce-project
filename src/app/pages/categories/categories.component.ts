import { Subscription } from 'rxjs';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategories } from '../../shared/interfaces/icategories';
import { SubCategoriesService } from '../../core/services/subCategories/sub-categories.service';
import { ISubcateogry } from '../../shared/interfaces/isubcateogry';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit, OnDestroy{

  private readonly categoriesService = inject(CategoriesService);
  private readonly subcategoriesService = inject(SubCategoriesService);

  categories:ICategories[] = [];
  categoryId:WritableSignal<string> = signal('') ;
  categoryName:WritableSignal<string> = signal('');
  subCategories:ISubcateogry[] = [];
  subCategorySub!:Subscription;
  categorySub!:Subscription;
  ngOnInit(): void {
    this.getAllCategories()
  }

  getAllCategories():void{
    this.categoriesService.getAllCategories().subscribe({
      next: (res)=>{
        console.log(res);
        this.categories = res.data;
      }
    })
  }


  getSpecifidCate(id:string):void{

   this.categorySub = this.categoriesService.getSpecificCategoy(id).subscribe({
      next: (res)=>{
        console.log(res.data._id);
        this.categoryId.set( res.data._id);
        this.categoryName.set( res.data.name);

        this.subCategorySub = this.subcategoriesService.getSpecifiedCatInCategory(res.data._id).subscribe({
          next: (res)=>{
            console.log(res.data);
            this.subCategories = res.data
            
          }
        })
      }
    })



  }
  
  ngOnDestroy(): void {
    this.subCategorySub.unsubscribe();
    this.categorySub.unsubscribe();
  }





}
