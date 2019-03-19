import { Component } from '@angular/core';
import {
  ModalController,
} from '@ionic/angular';
import { GlobalService } from '@services/global.service';

@Component({
  selector: 'modal-qr-img',
  templateUrl: 'qr-img.html',
  styleUrls: ['./qr-img.scss']
})
export class QRImgModal {
  public qrcodeUrl: String;
  public username: String;
  public bio: String;
  public headImg: String;

  constructor(
    private modalCtrl: ModalController,
    private globalservice: GlobalService,
  ) {
    const userid = this.globalservice.userinfo._id;
    const username = this.globalservice.userinfo.username;
    this.bio = this.globalservice.userinfo.bio;
    this.headImg = this.globalservice.userinfo.img;
    if (!this.headImg) {
      this.headImg = '/assets/imgs/logo.png';
    }
    this.username = username;
    this.qrcodeUrl =
      'http://qr.liantu.com/api.php?&bg=ffffff&fg=cc0000&text=' +
      userid +
      '_' +
      username;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  ionViewDidLeave() { }
}
