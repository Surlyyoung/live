import { Component, OnInit, Input, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
// import { UploaderService } from '../../../service/uploader.service';
import { API } from '@shared/utils/api';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.less'],
})
export class ImageUploaderComponent implements OnInit {
  /**
   * 图片上传(上传至阿里云点播)组件：
   * @params
   * (parentNode): 整个父对象
   * (maxCount): 最大上传数，默认值3
   * (minCount): 最小上传数，默认值1
   * @description
   * 1. 组件会访问form.value.mediaUrl，父组件需要有form表单，并包含字段mediaUrl(多个图片链接以逗号隔开的字符串);
   * 2. 组件会调用form.patchValue({ 'mediaUrl': mediaUrl })进行表单赋值;
   * 3. 组件会在所有文件上传成功后(onUploadEnd)调用parentNode.save()，父组件需要save方法(可选)做提交表单操作;
   */
  @Input() parentNode: any;
  @Input() maxCount = 999; // 最大上传数
  @Input() minCount = 1; // 最小上传数
  @Input() isTriggerSubmit: Boolean = true; // 是否触发提交表单，默认触发
  @Input() hasCallback: Boolean = false; // 是否选择后有回调
  @Input() canSelectFromLocal = true; // 是否可以本地选择图片 不用于表单字段
  @Input() callbackFn = 'save'; // 成功回调的函数名，默认为save
  @Input() mediaUrl = 'mediaUrl'; // 表单中保存图片的字段,默认为mediaUrl
  @Input() size = 'normal'; // 选择框大小，默认normal
  @Input() tips = '支持JPG、PNG格式，图片小于3M'; // 上传说明
  @ViewChild('tplInput', { static: false }) tplInput: TemplateRef<any>;

  public modalRef: NzModalRef;
  public picUrls: any[] = []; // 用于显示图片的图片列表
  public restCount = 999; // 剩余可选数量
  public list: any[] = []; // 图片库列表
  public selectedList: any[] = []; // 图片库中 选中的图片列表
  // public selectedTempList: any[] = []; // 与图片库列表保持数量一致的列表
  public selectedObj: any = {}; // key:选中图片url，value:计数
  public uploadCount: number; // 上传文件的数量
  public counter = 0; // 真实上传数量
  public selectedNum = 1; // 选中的序号

  // 搜索条件
  public searchCond: any = {
    name: null,
    upLevel: null,
  };
  // 层级，默认首级
  levels: any[] = [
    {
      id: '',
      name: '首级',
    },
  ];

  /*
   * 上传相关
   */
  // 阿里云上传接口参数
  public timeout = '';
  public partSize = '';
  public parallel = '';
  public retryCount = '';
  public retryDuration = '';
  public region = 'cn-shanghai';
  public userId = 'LTAI4FmdLhsrod5U2U1bWcv2';

  public authObjs: any[] = []; // 缓存阿里上传图片的信息（地址，凭证等）
  // 上传对象及上传状态等
  public uploader = null;
  public uploadLoading = false;
  public authProgress = 0;
  public statusText = '';
  public isAllFileUploaded = false; // 全部上传完标志
  // 分页
  public allCount: number;
  public pageSize = 23;
  public nowPage = 1;

  // 消息id
  public msgId: any;

  constructor(
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private modalSrv: NzModalService,
    private msgSrv: NzMessageService,
  ) {}

  ngOnInit() {}

  searchImg() {
    this.nowPage = 1;
    this.loadList();
  }
  resetSearch() {
    this.searchCond = {};
    this.nowPage = 1;
    this.levels = [
      {
        id: '',
        name: '首级',
      },
    ];
    this.loadList();
  }
  // 弹出框
  selectFile(tplInput: TemplateRef<any>) {
    this.loadList();

    const len = this.picUrls.length;
    const url = this.parentNode.form.value[this.mediaUrl];
    this.restCount = len ? this.maxCount - len : this.maxCount;
    this.modalRef = this.modalSrv.create({
      nzTitle: '选择图片',
      nzContent: tplInput,
      nzWidth: '958',
      nzOnOk: () => {
        let mediaUrl = '';
        this.selectedList.forEach((val, i) => {
          if (i === 0) {
            mediaUrl += val.url;
          } else {
            mediaUrl += ',' + val.url;
          }
        });
        mediaUrl = url ? url + ',' + mediaUrl : mediaUrl;
        this.parentNode.form.patchValue({ [this.mediaUrl]: mediaUrl });
        this.selectedList.forEach(val => {
          this.picUrls.push({ type: 'normal', src: val.url });
        });
        if (this.hasCallback) {
          // 调用父组件的保存方法 默认save
          if (this.parentNode[this.callbackFn] && typeof this.parentNode[this.callbackFn] === 'function')
            this.parentNode[this.callbackFn](mediaUrl);
        }
        // 重置
        this.selectedList = [];
        // this.selectedTempList = [];
        this.selectedNum = 1;
        this.selectedObj = {};
        this.searchCond = {};
        this.nowPage = 1;
        this.levels = [
          {
            id: '',
            name: '首级',
          },
        ];

        this.cdr.detectChanges();
      },
      nzOnCancel: () => {
        this.restCount = 999;
        this.selectedList = [];
        // this.selectedTempList = [];
        this.selectedNum = 1;
        this.selectedObj = {};
        this.searchCond = {};
        this.nowPage = 1;
        this.levels = [
          {
            id: '',
            name: '首级',
          },
        ];
      },
    });
  }
  destroyTpl() {
    this.modalRef.destroy();
  }

  // 操作图片上传相关
  convertToBase64Async(file: any) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        const base64Src: any = (e.target as any).result;
        resolve(base64Src);
      };
    });
  }
  handleChange(e: any) {
    const files: any = (e.target as any).files;
    const fileType = ['image/png', 'image/jpeg', 'image/gif'];
    const len = files.length;
    const maxSize = 3 * 1024 * 1000;
    // if (this.restCount < len) {
    //   this.msgSrv.warning(`还剩${this.restCount}张图片可以上传！`)
    //   return false;
    // }
    // if (len < this.minCount || len > this.maxCount) {
    //   this.msgSrv.warning(`最多支持上传${this.maxCount}张，最少${this.minCount}张图片！`)
    //   return false;
    // }
    for (let i = 0; i < len; i++) {
      const fileSize = files[i].size;
      if (fileType.indexOf(files[i].type) < 0) {
        this.msgSrv.warning("只支持'jpg', 'png', 'jpeg', 'gif'结尾的图片！");
        return false;
      }
      if (fileSize > maxSize) {
        this.msgSrv.warning('请选择不大于3M的图片！');
        return false;
      }
    }

    if (this.uploader) {
      this.uploader.stopUpload();
    } else {
      this.uploader = this.createUploader();
    }

    this.uploadCount = len;
    for (let i = 0; i < len; i++) {
      this.addFile(files[i]);
      // this.convertToBase64Async(files[i]).then((base64: string) => {
      //   this.picUrls.push({ type: 'base64', src: base64 });
      //   this.cdr.detectChanges();
      //   this.selectedList = [];

      //   this.destroyTpl();
      // });
    }
  }
  removePic(index: number, pic: any) {
    let base64s: any[] = [];
    if (pic.type === 'base64') {
      base64s = this.picUrls.filter((val, idx) => {
        if (val.type === 'base64') {
          val.index = idx;
          return true;
        }
      });
      base64s.forEach((val, i) => {
        if (val.index === index) {
          this.deleteUploadFile(i);
          this.authObjs.splice(i, 1);
        }
      });
    }
    this.picUrls.splice(index, 1);
    const mediaUrls = this.parentNode.form.value[this.mediaUrl].split(',');
    mediaUrls.splice(index, 1);
    // 删除后，重新赋值form
    this.parentNode.form.patchValue({ [this.mediaUrl]: mediaUrls.join(',') });
  }

  // 阿里云点播上传 相关方法
  deleteUploadFile(index: number) {
    if (this.uploader) this.uploader.deleteFile(index);
  }
  authUpload() {
    // 调用 startUpload 方法, 开始上传
    if (this.uploader) this.uploader.startUpload();
  }
  createUploader(): any {
    const self = this;
    let uploader = new AliyunUpload.Vod({
      timeout: self.timeout || 3000,
      partSize: self.partSize || 1048576,
      parallel: self.parallel || 5,
      retryCount: self.retryCount || 2,
      retryDuration: self.retryDuration || 2,
      region: self.region,
      userId: self.userId,
      // 添加文件成功
      addFileSuccess(uploadInfo) {
        self.counter++;
        if (self.counter === self.uploadCount) {
          self.statusText = '文件添加成功';
          console.log(self.statusText);
          self.authUpload();
          self.msgId = self.msgSrv.loading('正在上传图片，请稍后...', { nzDuration: 0 }).messageId;

          self.counter = 0;
        }
        self.getImageAuth(uploadInfo, (res): void => {
          self.authObjs.push({
            uploadInfo,
            uploadAuth: res.uploadAuth,
            uploadAddress: res.uploadAddress,
            imageId: res.imageId,
            imageURL: res.imageURL,
          });
          uploader.setUploadAuthAndAddress(uploadInfo, res.uploadAuth, res.uploadAddress, res.imageId);
        });
      },
      // 开始上传
      onUploadstarted(uploadInfo) {
        self.statusText = '文件开始上传...';
        console.log(self.statusText);
      },
      // 文件上传成功
      onUploadSucceed(uploadInfo) {
        self.statusText = '文件上传成功!';
      },
      // 文件上传失败
      onUploadFailed(uploadInfo, code, message) {
        console.log('onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + message);
        self.statusText = '文件上传失败!';
        self.msgSrv.remove(this.msgId);
        self.msgSrv.error(`文件-${uploadInfo.file.name}上传失败！`);
        const list = uploader.listFiles();
        for (let i = 0; i < list.length; i++) {
          if (list[i].file.name === uploadInfo.file.name) {
            uploader.cancelFile(i);
            uploader.deleteFile(i);
          }
        }

        uploader = null;
      },
      // 取消文件上传
      onUploadCanceled(uploadInfo, code, message) {
        self.statusText = '文件已暂停上传';
      },
      // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
      onUploadProgress(uploadInfo, totalSize, progress) {
        const progressPercent = Math.ceil(progress * 100);
        self.statusText = '文件上传中...';
      },
      // 上传凭证超时
      onUploadTokenExpired(uploadInfo) {
        // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
        // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
        // 然后调用 resumeUploadWithAuth 方法
        self.statusText = '文件超时...';
      },
      // 全部文件上传结束
      onUploadEnd(uploadInfo) {
        self.statusText = '文件上传完毕';
        console.log(self.statusText);
        self.isAllFileUploaded = true;

        const list = self.authObjs;
        const picArr = [];
        for (let i = 0; i < list.length; i++) {
          picArr.push({
            category: 1008,
            name: list[i].uploadInfo.file.name,
            picUrl: list[i].imageURL,
          });

          // if (self.restCount <= 0) {
          //   self.restCount = 0;
          //   self.msgSrv.warning('已选至上限！');
          // } else {
          //   self.selectedList.push(list[i].imageURL);
          //   self.restCount--;
          // }

          self.list.unshift({ picUrl: list[i].imageURL, name: list[i].uploadInfo.file.name });
        }

        self.saveInPictureRoom(picArr);
        self.authObjs = [];

        // 调用父组件的保存方法
        // if (self.isTriggerSubmit && self.parentNode[self.callbackFn] && typeof (self.parentNode[self.callbackFn]) === 'function')
        //   self.parentNode[self.callbackFn]();
      },
    });
    return uploader;
  }
  addFile(file: File) {
    this.uploader = this.createUploader();
    this.uploader.addFile(file, null, null, null, '{"Vod":{}}');
  }

  // 获取阿里云图片凭证
  getImageAuth(uploadInfo: any, cb: any) {
    const createUrl = API.PLATFORM_IMAGE_AUTH;
    this.http
      .post(createUrl, {
        imageExt: uploadInfo.file.name.slice(uploadInfo.file.name.lastIndexOf('.') + 1),
        imageType: 'default',
        title: uploadInfo.file.name,
      })
      .subscribe((res: any) => {
        // res.data.imageURL
        // let mediaUrl = this.parentNode.form.value[this.mediaUrl];
        // mediaUrl = mediaUrl ? mediaUrl.concat(',' + res.data.imageURL) : res.data.imageURL;
        // this.parentNode.form.patchValue({ [this.mediaUrl]: mediaUrl })
        cb(res.data);
      });
  }
  // 获取图片列表
  loadList() {
    this.http
      .post(API.PLATFORM_IMAGE_LIST, {
        nowPage: this.nowPage,
        size: this.pageSize,
        data: this.searchCond,
      })
      .subscribe((res: any) => {
        this.list = res.data;
        // this.selectedTempList = new Array(this.list.length).fill(null);
        this.allCount = res.dataGrid.allCount;
        this.cdr.detectChanges();
      });
  }
  changePageIndex(data: any) {
    this.loadList();
  }

  // 面包屑导航
  navTo(item, index) {
    this.searchCond.upLevel = '';

    if (index !== this.levels.length - 1) {
      this.searchCond.upLevel = item.id;
      this.nowPage = 1;

      const i = this.levels.length - index - 1;
      this.levels.splice(index + 1, i);
      this.loadList();
    }
  }
  // 图片列表中选择图片
  selectFileInList(index: number, pic: any) {
    // let pos: number;

    // 选中文件夹
    if (pic.categoryInner === 2) {
      this.searchCond = {};
      this.nowPage = 1;

      this.searchCond.upLevel = pic.id;
      this.levels.push({
        id: pic.id,
        name: pic.name,
      });

      this.loadList();
      return false;
    }

    // 取消选中
    this.selectedList.forEach((value, idx) => {
      if (value.url.includes(pic.picUrl)) {
        // pos = index;
        this.selectedList.splice(idx, 1);
        this.selectedNum--;
        this.restCount++;
      }
    });

    // if (pos || pos === 0) {
    //   const cancelIdx = this.selectedTempList[index] ? this.selectedTempList[index].index : 0;
    //   this.selectedTempList.forEach((item, i) => {
    //     if (item && item.index >= cancelIdx) {
    //       item.index--;
    //     }
    //   })
    //   this.selectedTempList[index] = null;
    //   return false;
    // }

    // 取消选中重新计数
    if (Object.keys(this.selectedObj).includes(pic.picUrl)) {
      const idx = this.selectedObj[pic.picUrl];
      for (const i in this.selectedObj) {
        if (this.selectedObj[i] > idx) this.selectedObj[i]--;
      }
      delete this.selectedObj[pic.picUrl];
      return false;
    }

    if (this.restCount <= 0) {
      this.restCount = 0;
      this.msgSrv.warning('已选至上限！');
      return false;
    }

    // 选中
    this.restCount--;
    this.selectedList.push({ url: pic.picUrl, index: this.selectedNum });

    // this.selectedTempList[index] = {};
    // this.selectedTempList[index].url = pic.picUrl;
    // this.selectedTempList[index].index = this.selectedNum;

    this.selectedObj[pic.picUrl] = this.selectedNum;
    this.selectedNum++;
  }

  /* 
  * 批量保存图片
  * {
        imageType: 'default',
        name,
        picUrl
      }
  */
  saveInPictureRoom(picArr: any[]) {
    this.http
      .post(API.PLATFORM_IMAGE_ADD, { upLevel: this.levels[this.levels.length - 1].id, modifyArr: picArr })
      .subscribe(() => {
        this.searchCond = {};
        // this.loadList();

        // picArr.forEach((item) => {
        //   if (this.restCount <= 0) {
        //     this.restCount = 0;
        //     this.msgSrv.warning('已选至上限！');
        //   } else {
        //     this.selectedList.push(item.picUrl);
        //     this.restCount--;
        //   }
        // })

        this.msgSrv.remove(this.msgId);
        this.msgSrv.success('文件上传成功');
      });
  }
}
