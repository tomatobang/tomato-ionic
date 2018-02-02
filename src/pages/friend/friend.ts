import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, Events } from 'ionic-angular';
import { QRScannerComponent } from '../../components/qr-scanner/qr-scanner';

@IonicPage()
@Component({
  selector: 'cmp-friend',
  templateUrl: 'friend.html',
})
export class FriendPage {
  public rankList: {
    title: string;
    image: string;
    tomatoNum: Number;
    minute: Number;
    rankText: string;
    class: string;
  }[] = [
    {
      title: '加油就有收获！',
      tomatoNum: 9,
      minute: 223,
      image: 'assets/imgs/logo.png',
      rankText: 'No. 1',
      class: 'rank1',
    },
    {
      title: '努力就能成功！',
      tomatoNum: 8,
      minute: 193,
      image: 'assets/tomato-active.png',
      rankText: 'No. 2',
      class: 'rank2',
    },
    {
      title: '天道酬勤，人道酬信！',
      tomatoNum: 5,
      minute: 123,
      image: 'assets/tomato-active.png',
      rankText: 'No. 3',
      class: 'rank3',
    },
    {
      title: '抓效率！',
      image: 'assets/tomato-grey.png',
      tomatoNum: 1,
      minute: 23,
      rankText: '',
      class: '',
    },
    {
      title: '我爱番茄帮！',
      image: 'assets/tomato-grey.png',
      tomatoNum: 1,
      minute: 21,
      rankText: '',
      class: '',
    },
  ];

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
