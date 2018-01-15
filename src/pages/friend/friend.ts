import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { NavController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-friend',
  templateUrl: 'friend.html',
})
export class FriendPage {
  showType = 'hot';

  constructor(public navCtrl: NavController, private qrScanner: QRScanner) {}

  toMessagePage() {
    this.navCtrl.push('MessagePage', {}, {}, () => {});
  }

  scanToAddFriend() {
    console.log('scanToAddFriend!');
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            alert('您扫描到了以下内容:' + JSON.stringify(text));
            this.qrScanner.hide(); 
            scanSub.unsubscribe(); 
          });
          this.qrScanner.show();
        } else if (status.denied) {
          alert('您已拒绝授予 TomatoBang 相机权限！');
        } else {
          alert('您暂时拒绝了授予 TomatoBang 相机权限！');
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }
}
