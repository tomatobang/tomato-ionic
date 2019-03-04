import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { QRScannerModal } from '@modals/qr-scanner/qr-scanner';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'cmp-popover',
  templateUrl: 'popover.html',
  styleUrls: ['popover.scss']
})
export class PopOverPage {
  constructor(
    public router: Router,
    private modalCtrl: ModalController,
    private popover: PopoverController) { }

  ionViewDidLoad() { }

  /**
  * 跳转至搜索页
  */
  ToSearchPage() {
    this.router.navigate(['tabs/friend/search']);
    this.popover.dismiss();
  }

  /**
   * 扫码加友
   */
  async scanToAddFriend() {
    this.popover.dismiss();
    const modal = await this.modalCtrl.create({
      component: QRScannerModal,
      showBackdrop: true,
    });
    modal.onDidDismiss().then(qrCode => {
      console.log(qrCode);
    });
    await modal.present();
  }

  /**
   * 跳转至通讯录
   */
  ToContactsPage() {
    this.popover.dismiss();
    this.router.navigate(['tabs/friend/contact']);
  }

  /**
   * 扫码回调
   * @param qrCode 二维码内容
   */
  onScanQRCode(qrCode: object) {
    alert('成功扫描到:' + JSON.stringify(qrCode));
    this.router.navigate(['tabs/friend/friendinfo'], {
      queryParams: {
        userid: JSON.stringify(qrCode),
      }
    });
  }
}
