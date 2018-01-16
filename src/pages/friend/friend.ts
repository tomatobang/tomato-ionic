import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, Events } from 'ionic-angular';
import { QRScannerComponent } from '../../components/qr-scanner/qr-scanner';

@IonicPage()
@Component({
  selector: 'page-friend',
  templateUrl: 'friend.html',
})
export class FriendPage {
  showType = 'hot';
  ionApp: HTMLElement;
  @ViewChild('qrScanner') qrScanner: QRScannerComponent;

  constructor(public navCtrl: NavController, private events: Events) {}

  toMessagePage() {
    this.navCtrl.push('MessagePage', {}, {}, () => {});
  }

  scanToAddFriend() {
    this.qrScanner.open();
  }

  onScanQRCode(qrCode: object) {
    console.log('成功扫描到:', qrCode);
    alert('成功扫描到:' + JSON.stringify(qrCode));
  }
}
