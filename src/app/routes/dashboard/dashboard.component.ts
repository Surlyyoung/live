import { Component, OnInit, Inject, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { tap, map } from 'rxjs/operators';
import { STComponent, STColumn, STData, STChange, STColumnBadge, STPage } from '@delon/abc';
import { Router, ActivatedRoute } from '@angular/router';
import { API } from '@shared/utils/api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {
  searchCond: any = {
    name: null,
  };
  // Modal相关
  isVisible = false;
  comfirmTitle = '提示';
  comfirmContent = '确认吗？';
  oprId: null;
  data: any[] = [];
  valids: any;
  validb: any;
  valid: any;
  stats: any[] = [
    {
      name: '发布中',
      id: 1,
    },
    {
      name: '草稿',
      id: 2,
    },
  ];
  product: any[] = [
    {
      name: '上架中',
      id: 1,
    },
    {
      name: '已下架',
      id: 2,
    },
  ];
  idxs: 1;
  loading = false;
  nowRouter: null;
  allCount: number;
  pageSize = 10;
  nowPage = 1;
  stPage: STPage = { front: false, show: true, showSize: true, showQuickJumper: true, total: `共{{total}}条记录` };
  status = [
    { index: 1, text: '上架中' },
    {
      index: 2,
      text: '已下架',
    },
  ];
  BADGE: STColumnBadge = {
    1: { text: '上架中', color: 'success' },
    2: { text: '已下架', color: 'error' },
  };

  @ViewChild('st', { static: true })
  st: STComponent;
  columns: STColumn[] = [
    { title: '', index: 'key', type: 'checkbox' },
    {
      title: '封面图',
      width: 80,
      render: 'picCustom',
      index: 'picUrl',
    },
    { title: '商品名称', index: 'name', width: '10%' },
    {
      title: '编号',
      width: '10%',
      index: 'code',
      type: 'number',
      format: (item: any) => `${item.code}`,
      sorter: (a: any, b: any) => a.xorder - b.xorder,
    },

    {
      title: '价格',
      index: 'salePrice',
      width: '10%',
      type: 'number',
      format: (item: any) => `￥${item.salePrice.toFixed(2)}`,
      sorter: (a: any, b: any) => a.salePrice - b.salePrice,
    },

    {
      title: '销量',
      index: 'outCount',
      type: 'number',
      format: (item: any) => `${item.outCount}`,
      sorter: (a: any, b: any) => a.outCount - b.outCount,
    },
    {
      title: '库存',
      index: 'storeCount',
      type: 'number',
      format: (item: any) => `${item.storeCount - item.outCount}`,
      sorter: (a: any, b: any) => a.storeCount - b.outCount,
    },
    {
      title: '分类/系列',
      render: 'sort',
      width: '10%',
      // format: (item: any) => `${item.sort}/${item.series}`,
    },
    {
      title: '状态',
      index: 'valid',
      width: '10%',
      type: 'badge',
      badge: this.BADGE,
      // format: (item: any) => `${this.status[item.valid - 1].text}`,
    },

    {
      title: '上架时间',
      index: 'publishTime',
      type: 'date',
      dateFormat: 'YYYY-MM-DD HH:mm',
      width: '10%',
      className: 'text-left',
      // format: (item: any) => `${item.publishTime || '-'}`,
    },
    {
      title: '操作',
      width: 120,
      buttons: [
        {
          text: '编辑',
          type: 'link',
          click: (item: any) => this.router.navigateByUrl(`/management/product/product-operate?id=${item.id}`),
        },
        {
          text: '下架',
          type: 'link',
          iif: (item: any) => item.valid === 1,
          iifBehavior: 'hide',
          click: (item: any) => this.operateProduct(item, 2),
        },
        {
          text: '上架',
          type: 'link',
          iif: (item: any) => item.valid === 2,
          iifBehavior: 'hide',
          click: (item: any) => this.operateProduct(item, 1),
        },
      ],
    },
  ];
  selectedRows: STData[] = [];
  description = '';
  totalCallNo = 0;
  expandForm = false;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private modal: ModalHelper,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private msgService: NzMessageService,
  ) {}

  ngOnInit() {
    this.getData();
    // this.nowRouter = this.activatedRoute.paramMap.url;
  }
  _onReuseInit() {
    this.getData();
  }

  getproduct(valid: number) {
    this.valid = valid;
    this.getremovelist(this.valid);
  }

  getData() {
    // this.prodSrv.nowPage = this.nowPage;
    // this.prodSrv.pageSize = this.pageSize;
    // if (!this.loading) {
    //   this.loading = true;
    //   this.prodSrv
    //     .getData()
    //     .then(res => {
    //       this.loading = false;
    //       if (this.prodSrv.data.length === 0 && this.prodSrv.allCount) {
    //         this.prodSrv.nowPage = this.prodSrv.nowPage > 1 ? this.prodSrv.nowPage - 1 : 1;
    //         this.getData();
    //       }
    //     })
    //     .catch(err => {
    //       this.loading = false;
    //     });
    //   this.http
    //   .post(API.MANAGE_PRODUCT_LIST, {
    //     nowPage: this.nowPage,
    //     pageSize: this.pageSize,
    //     data: this.searchCond,
    //   })
    //   .pipe(
    //     tap(() => {
    //       this.loading = false;
    //     }),
    //   )
    //   .subscribe((res: any) => {
    //     this.data = res.data;
    //     this.allCount = res.dataGrid.allCount;
    //     if (res.data.length === 0 && res.dataGrid.allCount) {
    //       this.nowPage = this.nowPage > 1 ? this.nowPage - 1 : 1;
    //       this.getData()
    //     }
    //     this.cdr.detectChanges();
    //   });
    // }
  }

  gosearch() {
    this.getData();
  }

  stChange(e: STChange) {
    // this.getData();
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        this.totalCallNo = this.selectedRows.reduce((allCount, cv) => allCount + cv.callNo, 0);
        this.cdr.detectChanges();
        break;
      case 'filter':
        break;
    }

    let isLoad = false;
    if (e.type === 'ps') {
      this.nowPage = 1;
      this.pageSize = e.ps;
      isLoad = true;
    } else if (e.type === 'pi') {
      this.nowPage = e.pi;
      isLoad = true;
    }
    if (isLoad) this.getData();
  }

  remove() {
    this.valid = 0;
    this.getremovelist(this.valid);
  }
  getremovelist(valid) {
    if (!this.selectedRows.length) {
      this.msgService.warning('请至少选择一项进行操作！');
      return false;
    }
    if (this.selectedRows.length > 0) {
      const ids = this.selectedRows.map(i => i.id).join(',');

      this.showComfirmModal(ids, valid);
    }
  }
  delOpr(id: any, valids: any) {
    // valids 0删除 1上架 2下架
    let msg = '操作成功';
    if (valids === 0) {
      msg = '删除成功';
    } else if (valids === 2) {
      msg = '下架成功';
    } else if (valids === 1) {
      msg = '上架成功';
    }
    this.http.get(API.MANAGE_PRODUCT_DEL, { ids: id, valid: valids }).subscribe(() => {
      this.msgService.success(msg, {
        nzDuration: 1000,
      });
      // this.hideComfirmModal();
      this.getData();
      this.st.clearCheck();
    });
  }

  // 单独上下架
  operateProduct(item: any, valid) {
    this.oprId = item.id;
    this.valids = valid;
    const tilte = `<b>你确认${valid === 2 ? '下架' : '上架'}该产品吗？</b>`;
    this.modalSrv.confirm({
      nzTitle: tilte,
      nzContent: `${item.name}（编号：${item.code}）`,
      nzOnOk: () => {
        this.delOpr(this.oprId, this.valids);
      },
    });
  }
  deleteProduct(id, valid) {
    this.oprId = id;
    this.valids = valid;
    this.modalSrv.confirm({
      nzTitle: '确认删除您所选的产品',
      nzContent: '删除后，产品将从列表中消失，请谨慎操作',
      nzOnOk: () => {
        this.delOpr(this.oprId, this.valids);
      },
    });
  }

  // Modal相关方法

  showComfirmModal(ids, valid): void {
    this.oprId = ids;
    this.valids = valid;
    // this.isVisible = true;
    let nzContent = '';
    let nzTitle = '<b>提示</b>';
    if (this.valids === 0) {
      nzTitle = '<b>确认删除您所选的产品</b>';
      nzContent = '删除后，产品将从列表中消失，请谨慎操作';
    } else if (this.valids === 2) {
      nzContent = '确认下架所选产品吗？';
    } else if (this.valids === 1) {
      nzContent = '确认上架所选产品吗？';
    }

    this.modalSrv.confirm({
      nzTitle,
      nzContent,
      nzOnOk: () => {
        this.delOpr(this.oprId, this.valids);
      },
    });
  }
  hideComfirmModal(): void {
    this.isVisible = false;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  handleComfirm(): void {
    this.delOpr(this.oprId, this.valids);
  }

  approval() {
    this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
  }

  add() {
    this.router.navigate(['/management/product/product-operate']);
  }

  reset() {}
}
