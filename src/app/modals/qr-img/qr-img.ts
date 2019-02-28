import { Component } from '@angular/core';
import {
  ModalController,
} from '@ionic/angular';
import { GlobalService } from '@services/global.service';

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
    private modalCtrl: ModalController,
    public globalservice: GlobalService,
  ) {
    const userid = this.globalservice.userinfo._id;
    const username = this.globalservice.userinfo.username;
    this.bio = this.globalservice.userinfo.bio;
    this.headImg = this.globalservice.userinfo.img;
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

  ionViewDidLeave() { }
}
