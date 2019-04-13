import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { PopOverPage } from './popover/popover';
import { InfoService } from '@services/info.service';
import { ChatIOService } from '@services/utils/socket.io.service';

@Component({
  selector: 'cmp-friend',
  templateUrl: 'friend.html',
  styleUrls: ['./friend.scss']
})
export class FriendPage implements OnInit {

  pullingIcon = false;
  isShowMenuCard = true;

  isPullToShow = false;
  messsageBadge = '';

  constructor(
    public chatIO: ChatIOService,
    private router: Router,
    private popoverController: PopoverController,
    public info: InfoService,
  ) {
  }

  ngOnInit() {
    this.info.messageCountMonitor.subscribe(data => {
      if (data !== undefined && data !== null) {
        if (data === 0) {
          this.messsageBadge = '';
        } else {
          this.messsageBadge = data;
        }
      }
    });
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
