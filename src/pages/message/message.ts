import { Component } from '@angular/core';

import { NavController, IonicPage } from 'ionic-angular';
import { QiniuUploadService } from '../../providers/qiniu.upload.service';

@IonicPage()
@Component({
  selector: 'cmp-message',
  templateUrl: 'message.html',
  providers: [QiniuUploadService],
})
export class MessagePage {
  toUser: Object;
  showType = 'msg';

  messageList = [
    {
      id: 1,
      name: '李四',
      info: '请求添加您为好友',
    },
    {
      id: 1,
      name: '王五',
      info: '请求添加您为好友',
    },
  ];

  constructor(public navCtrl: NavController, public qiniu: QiniuUploadService) {
    this.toUser = {
      toUserId: '210000198410281948',
      toUserName: 'Hancock',
    };
  }

  toChatPage() {
    console.log('setting!');
    this.navCtrl.push('Chat', this.toUser, {}, () => {});
  }

  responseReq() {}

  getQiniuUploadToken() {
    this.qiniu.getUploadToken().subscribe(
      data => {
        console.log('qiniutoken:', data);
        // debugger;
        this.qiniu.init(data.uploadToken);
      },
      err => {
        // debugger;
      }
    );
  }
}
