import { Component, OnInit, Inject, ViewChild, TemplateRef, LOCALE_ID, ChangeDetectorRef } from '@angular/core';
import { ProductService } from './product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.less'],
})
export class AddProductComponent implements OnInit {
  constructor(public srv: ProductService) {}

  ngOnInit() {}

  switchTo(tab: any) {
    this.srv.pos = tab.id;
  }
}
