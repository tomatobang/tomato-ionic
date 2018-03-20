import { Component } from '@angular/core';
import {
  App,
  IonicPage,
  ViewController,
  NavParams,
  Platform,
} from 'ionic-angular';

import lodash from 'lodash';

@IonicPage()
@Component({
  selector: 'modal-qr-img',
  templateUrl: 'qr-img.html',
})
export class QRImgModal {
  private qrcodeUrl: String;
  private username: String;
  private bio: String;
  private headImg: String;

  constructor(
    private app: App,
    private params: NavParams,
    private viewCtrl: ViewController,
    private platform: Platform
  ) {
    const userid = params.get('userid');
    const username = params.get('username');
    this.bio = params.get('bio');
    this.headImg = params.get('headImg');

    this.username = username;
    this.qrcodeUrl =
      'http://qr.liantu.com/api.php?&bg=ffffff&fg=cc0000&text=' +
      userid +
      '_' +
      username;
  }

  private dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLeave() {}
}
