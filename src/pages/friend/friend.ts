import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, Events } from 'ionic-angular';
import { QRScannerComponent } from '../../components/qr-scanner/qr-scanner';

@IonicPage()
@Component({
  selector: 'cmp-friend',
  templateUrl: 'friend.html',
})
export class FriendPage {
  showType = 'hot';
  ionApp: HTMLElement;
  @ViewChild('qrScanner') qrScanner: QRScannerComponent;

  constructor(public navCtrl: NavController, private events: Events) {}

  /**
   * 跳转至消息页
  */
  toMessagePage() {
    this.navCtrl.push('MessagePage', {}, {}, () => {});
  }

  /**
   * 扫码加友
  */
  scanToAddFriend() {
    this.qrScanner.open();
  }

  /**
   * 跳转至通讯录
  */
  ToContactsPage() {
    this.navCtrl.push('ContactsPage', {}, {}, () => {});
  }

  /**
   * 扫码回调
   * @param qrCode 二维码内容
   */
  onScanQRCode(qrCode: object) {
    console.log('成功扫描到:', qrCode);
    alert('成功扫描到:' + JSON.stringify(qrCode));
  }

  /**
   * 扫码错误回调
   * @param evt evt info
   */
  onScanQRCodeERR(evt) {
    console.log(evt);
  }
}
