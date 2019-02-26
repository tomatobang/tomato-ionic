import { Component } from '@angular/core';
import {
  ModalController,
  NavParams,
} from '@ionic/angular';

@Component({
  selector: 'modal-qr-img',
  templateUrl: 'qr-img.html',
})
export class QRImgModal {
  public qrcodeUrl: String;
  public username: String;
  public bio: String;
  public headImg: String;

  constructor(
    private params: NavParams,
    private modalCtrl: ModalController,
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
    this.modalCtrl.dismiss();
  }

  ionViewDidLeave() {}
}
