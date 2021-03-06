import { API } from '@shared/utils/api';
import { Component, OnInit, Inject, ViewChild, TemplateRef, LOCALE_ID, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { formatDate, Location } from '@angular/common';

@Component({
  selector: 'app-add-live',
  templateUrl: './add-live.component.html',
  styles: [],
})
export class AddLiveComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public msg: NzMessageService,
    private msgService: NzMessageService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private api: API,
  ) {
    this.form = this.fb.group({
      id: null,
      name: [null, [Validators.required]],
      description: null,
      code: [null, [Validators.required]],
      sort: [null, [Validators.required]],
      series: [null, [Validators.required]],
      salePrice: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      storeCount: [null, [Validators.required, Validators.pattern(/^\d*$/)]],
      spec: null,
      xorder: [null, Validators.pattern(/^\d*$/)],
      valid: 1,
      publishDate: null,
      picUrl: [null],
      piclist: [null],
      htmlContent: [null],
      paragraphs: [[]], //
    });
  }

  form: FormGroup;

  ngOnInit() {}

  save() {}
  goBack() {
    this.location.back();
  }
}
