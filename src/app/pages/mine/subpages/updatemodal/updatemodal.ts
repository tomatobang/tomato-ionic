import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cmp-updatemodal',
  templateUrl: 'updatemodal.html',
  styleUrls: ['./updatemodal.scss']
})
export class UpdatemodalPage implements OnInit {
  update: string;
  page_title: string;
  label: string;
  value: any;
  constructor(private modalCtrl: ModalController, private actrouter: ActivatedRoute) {
  }

  ngOnInit() {
    const update = this.update;
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

  /**
   * 取消
   */
  dismiss() {
    this.modalCtrl.dismiss();
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
        ret = { bio: this.value };
        break;
      default:
        break;
    }
    this.modalCtrl.dismiss(ret);
  }
}
