import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AddBasicComponent } from './add-product/add-basic/add-basic.component';
import { AddMainComponent } from './add-product/add-main/add-main.component';
import { AddPicsComponent } from './add-product/add-pics/add-pics.component';
import { AddExtraComponent } from './add-product/add-extra/add-extra.component';

@NgModule({
  declarations: [
    ProductListComponent,
    AddProductComponent,
    AddBasicComponent,
    AddMainComponent,
    AddPicsComponent,
    AddExtraComponent,
  ],
  imports: [CommonModule, ProductRoutingModule, SharedModule],
  entryComponents: [],
})
export class ProductModule {}
