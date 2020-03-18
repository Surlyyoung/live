import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  tabs: any[] = [
    {
      id: 0,
      name: '基本信息',
      link: 'basic',
    },
    {
      id: 1,
      name: '商品参数',
      link: 'main',
    },
    {
      id: 2,
      name: '图片/视频',
      link: 'media',
    },
    {
      id: 3,
      name: '是否上架',
      link: 'extra',
    },
  ];
  pos = 0; // tab position

  switchTo(tab: any) {
    this.pos = tab.id;
  }
}
