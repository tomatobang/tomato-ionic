/*
 * @Author: kobepeng
 * @Date: 2017-11-25 19:57:50
 * @Last Modified by: kobepeng
 * @Last Modified time: 2017-11-30 12:53:54
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

declare var window;
@IonicPage()
@Component({
  selector: 'page-updatemodal',
  templateUrl: 'updatemodal.html'
})
export class UpdatemodalPage implements OnInit {
  update: string;
  page_title: string;
  label: string;
  value: any;
  constructor(public viewCtrl: ViewController, params: NavParams) {
    const update = params.get('update');
    const value = params.get('value');
    this.value = value;
    this.update = update;
    switch (update) {
      case 'sex':
        this.page_title = '更新性别';
        this.label = '性别';
        break;
      case 'displayname':
        this.page_title = '更新昵称';
        this.label = '昵称';
        break;
      case 'email':
        this.page_title = '更新邮箱';
        this.label = '邮箱';
        break;
      case 'location':
        this.page_title = '更新地址';
        this.label = '地址';
        break;
      case 'bio':
        this.page_title = '更新签名';
        this.label = '签名';
        break;
      default:
        break;
    }
  }

  ngOnInit() {}

  /**
   * 取消
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   * 保存
   */
  save() {
    let ret = {};
    switch (this.update) {
      case 'sex':
        ret = { sex: this.value };
        break;
      case 'displayname':
        ret = { displayname: this.value };
        break;
      case 'email':
        ret = { email: this.value };
        break;
      case 'location':
        ret = { location: this.value };
        break;
      case 'bio':
        ret = { location: this.value };
        break;
      default:
        break;
    }
    this.viewCtrl.dismiss(ret);
  }
}
