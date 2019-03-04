import { Component } from '@angular/core';
import { ChatIOService } from '@services/utils/socket.io.service';
import { GlobalService } from '@services/global.service';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { RebirthHttpProvider } from 'rebirth-http';
import { PopOverPage } from './popover/popover';

@Component({
  selector: 'cmp-friend',
  templateUrl: 'friend.html',
  styleUrls: ['./friend.scss']
})
export class FriendPage {

  pullingIcon = false;
  isShowMenuCard = true;

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
        tomatoNum: 11,
        minute: 223,
        image: 'assets/imgs/logo.png',
        rankText: '1st',
        class: 'rank1',
      },
      {
        title: '努力就能成功！',
        tomatoNum: 8,
        minute: 193,
        image: 'assets/tomato-active.png',
        rankText: '2nd',
        class: 'rank2',
      },
      {
        title: '天道酬勤，人道酬信！',
        tomatoNum: 5,
        minute: 123,
        image: 'assets/tomato-active.png',
        rankText: '3rd',
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
  isPullToShow = false;
  ionApp: HTMLElement;

  constructor(
    public chatIO: ChatIOService,
    public globalservice: GlobalService,
    public rebirthProvider: RebirthHttpProvider,
    private router: Router,
    private popoverController: PopoverController
  ) {
    this.rebirthProvider.headers({ Authorization: this.globalservice.token }, true);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopOverPage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
  /**
   * 跳转至消息页
   */
  toMessagePage() {
    this.router.navigate(['tabs/friend/message']);
  }

  toFriendInfo() {
    this.router.navigate(['tabs/friend/friendinfo']);
  }

  /**
   * 扫码错误回调
   * @param evt evt info
   */
  onScanQRCodeERR(evt) {
    console.log('扫码错误', evt);
  }
}
