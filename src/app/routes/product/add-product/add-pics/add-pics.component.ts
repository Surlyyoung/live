import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

import { ProductService } from '../product.service';
import { API } from '@shared/utils/api';

@Component({
  selector: 'app-add-pics',
  templateUrl: './add-pics.component.html',
  styleUrls: ['./add-pics.component.less'],
})
export class AddPicsComponent implements OnInit, AfterViewInit {
  @ViewChild('imgLoader', { static: false }) imgLoader: any;
  constructor(
    private fb: FormBuilder,
    private productSrv: ProductService,
    private api: API,
    private router: Router,
    private msgSrv: NzMessageService,
  ) {}

  form: FormGroup;
  submitLoading = false;

  // 描述 -编辑框
  /**
   * paragraphs:
   * {
   *    type: 'img', //img;text
   *    value: string,
   * }
   */
  paragraphs: any[] = [];
  isEdit = false;
  editIndex: number;

  isHover = false;

  ngOnInit() {
    this.form = this.fb.group({
      id: null,
      name: null,
      description: null,
      code: null,
      sort: null,
      series: null,
      salePrice: null,
      storeCount: null,
      spec: null,
      xorder: null,
      valid: null,
      publishDate: null,
      picUrl: [null],
      piclist: [null],
      htmlContent: null,
      tempStr: null,
    });

    // this.form.patchValue(this.productSrv);
    // this.paragraphs = this.productSrv.paragraphs;
  }
  ngAfterViewInit() {
    // 赋值子组件的图片属性
    // if (this.productSrv.piclist)
    //   this.productSrv.piclist.split(',').forEach(val => {
    //     this.imgLoader.picUrls.push({ type: 'normal', src: val });
    //   });
  }

  editDone() {
    this.isEdit = false;
    const text = this.form.value.tempStr;
    this.paragraphs.push({
      picUrl: '',
      categoryInner: 'text',
      description: text.replace(/[\n\r]/g, '<br>'),
    });

    this.form.patchValue({ tempStr: '' });
  }
  editCancle() {
    this.isEdit = false;
  }
  moveUp(index: number) {
    const temp = this.paragraphs.splice(index, 1);
    this.paragraphs.splice(index - 1, 0, ...temp);
  }
  moveDown(index: number) {
    const temp = this.paragraphs.splice(index, 1);
    this.paragraphs.splice(index + 1, 0, ...temp);
  }
  deletePara(index: number) {
    this.paragraphs.splice(index, 1);
  }
  confirmImage(pic: string) {
    const pics = pic.split(',');
    if (this.editIndex || this.editIndex === 0) {
      let i = this.editIndex;
      pics.map((val: any) => {
        this.paragraphs.splice(i++, 0, {
          categoryInner: 'img',
          description: '',
          picUrl: val,
        });
      });

      return false;
    }
    pics.map((val: any) => {
      this.paragraphs.push({
        description: '',
        categoryInner: 'img',
        picUrl: val,
      });
    });

    // this.generateHtml(this.paragraphs);
  }
  addPicByIndex(index: number) {
    this.editIndex = index;
  }
  generateHtml(nodes: any[]) {
    /**
     * nodes:
     * {
     *    categoryInner: 'img', //img;text
     *    description: '',
     *    picUrl: string,
     * }
     */
    let html = '';

    html += '<div class="editor-paragraph">';
    nodes.map((val: any) => {
      if (val.type === 'text') {
        html += `<p>${val.description}</p>`;
      } else {
        html += `<img style="max-width:100%;" src=${val.picUrl} />`;
      }
    });
    html += '</div>';
    // this.form.patchValue({ htmlContent: html });
  }

  submitForm() {
    this.form.patchValue({ htmlContent: this.paragraphs });
    if (!this.form.value.piclist) {
      this.msgSrv.warning('请选择图片！');
      return false;
    }
    if (!this.form.value.htmlContent.length) {
      this.msgSrv.warning('请填写详情描述！');
      return false;
    }
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) return false;
    this.form.patchValue({
      picUrl: this.form.value.piclist.split(',')[0],
    });
    this.api._http(API.MANAGE_PRODUCT_ADD, this.form.value, (res: any) => {
      this.optSuccess();
    });
  }

  optSuccess() {
    this.submitLoading = false;
    this.navTo('/management/product');
    this.msgSrv.success('操作成功', { nzDuration: 1000 });
  }

  prevStep(): void {
    this.productSrv.pos--;
    Object.assign(this.productSrv, this.form.value);
  }
  nextStep(): void {
    Object.assign(this.productSrv, this.form.value);
    this.productSrv.pos++;
  }

  navTo(url: string): void {
    this.router.navigateByUrl(url);
  }
}
