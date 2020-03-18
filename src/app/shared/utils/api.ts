/**
 * 后端接口定义
 */
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Injectable({
  providedIn: 'root',
})
export class API {
  constructor(private http: _HttpClient) {}
  /**
   * 登录
   */
  static LOGIN_ACCOUNT = 'login/account';

  /**
   * 第三方平台信息
   */

  static PLATFORM_IMAGE_LIST = 'storePic/list'; // 获取图片列表接口
  static PLATFORM_IMAGE_AUTH = 'storePic/auth'; // 图片上传接口
  static PLATFORM_IMAGE_MOVE = 'storePic/move'; // 图片移动至文件夹
  static PLATFORM_FOLDER_ADD = 'storePic/saveOrUpdate'; // 新增文件夹接口
  static PLATFORM_IMAGE_ADD = 'storePic/uploadPic';
  static PLATFORM_IMAGE_DEL = 'storePic/delete';

  static PLATFORM_IMAGE_DETAIL = 'pic/';
  static PLATFORM_IMAGE_ADDBATCH = 'pic/saveBatch';
  static PLATFORM_IMAGE_UPDATE = 'pic/update';

  /**
   * 功能接口
   */
  static PIC_STORE_LIST = 'picStore/list';

  /**
   *  用户信息
   */
  static USER_INFO = 'user/userInfo';

  /**
   * 行政区划
   */
  static REGION = 'region/tree';

  /**
   * 首页
   */
  static ANALYSIS_TITLE = 'order/getTitleInfo';
  static ANALYSIS_SALE_COUNT = 'order/getMainInfo';
  static ANALYSIS_SALE_INFO = 'order/getSaleInfo';
  static ANALYSIS_SALE_SORT = 'order/getSortInfo';

  /**
   *  管理类接口
   */

  static MANAGE_PRODUCT_LIST = 'shopProduct/list';
  static MANAGE_PRODUCT_DEL = 'shopProduct/delete';
  static MANAGE_PRODUCT_DETAIL = 'shopProduct/detail';
  static MANAGE_PRODUCT_ADD = 'shopProduct/saveOrUpdate';
  static MANAGE_ORDER_LIST = 'order/list';
  static MANAGE_ORDER_DEL = 'order/delete';
  static MANAGE_ORDER_CLOSE = 'order/closeOrder';
  static MANAGE_ORDER_SEND = 'order/updateLogistics';
  static MANAGE_ORDER_DETAIL = 'order/detail';
  static MANAGE_MATERIAL_LIST = 'm/detail';
  static MANAGE_SHARE_LIST = 'share/list';
  static MANAGE_SHARE_ADD = 'share/saveOrUpdate';
  static MANAGE_SHARE_DETAIL = 'share/detail';
  static MANAGE_SHARE_DEL = 'share/delete';
  static MANAGE_GIFT_LIST = 'gift/list';
  static MANAGE_GIFT_DETEIL = 'gift/detail';
  static MANAGE_GIFT_ADD = 'gift/saveOrUpdate';

  /**
   * 功能类接口
   */

  static FUNCTION_SERIES_LIST = 'series/list';
  static FUNCTION_SERIES_DEL = 'series/delete';
  static FUNCTION_SERIES_DETAIL = 'series/detail';
  static FUNCTION_SERIES_ADD = 'series/saveOrUpdate';
  static FUNCTION_CLASSIFY_LIST = 'sort/list';
  static FUNCTION_CLASSIFY_DEL = 'sort/delete';
  static FUNCTION_CLASSIFY_DETAIL = 'sort/detail';
  static FUNCTION_CLASSIFY_ADD = 'sort/saveOrUpdate';
  static FUNCTION_MODULE_LIST = 'module/list';
  static FUNCTION_MODULE_DEL = 'module/delete';
  static FUNCTION_MODULE_DETAIL = 'module/detail';
  static FUNCTION_MODULE_ADD = 'module/saveOrUpdate';
  static FUNCTION_MEMBER_LIST = 'member/list';
  static FUNCTION_MEMBER_DEL = 'member/delete';
  static FUNCTION_MEMBER_DETAIL = 'member/detail';

  static FUNCTION_ACCOUNT_DETAIL = 'userAdmin/detail';
  static FUNCTION_ACCOUNT_ADD = 'userAdmin/saveOrUpdate';
  static FUNCTION_ACCOUNT_LIST = 'userAdmin/list';
  static FUNCTION_ACCOUNT_DEL = 'userAdmin/delete';

  /**
   * 统计类接口
   */
  static ANALYSICS_FINANCE_LIST = 'finance/list';
  static ANALYSICS_FINANCE_DETAIL = 'finance/detail';
  static ANALYSICS_USER_LIST = '';
  static ANALYSICS_VISITOR_LIST = '';

  public _http(url, data = {}, cb?: Function, options?: {}) {
    this.http.post(url, data, null, options).subscribe((res: any) => {
      cb(res);
    });
  }
}
