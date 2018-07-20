import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, Content, IonicPage, NavParams } from 'ionic-angular';

import { ChatIOService } from '@providers/utils/socket.io.service';
import { GlobalService } from '@providers/global.service';
import { OnlineUserService } from '@providers/data.service';

@IonicPage()
@Component({
  selector: 'page-friendinfo',
  templateUrl: 'friendinfo.html',
})
export class FriendInfoPage {
  friendid;
  friendName = '';
  userid;
  bio = '';
  isFriend = false;

  @ViewChild(Content) content: Content;
  showToolbar = false;
  headerImgSize = '100%';
  headerImgUrl = '';
  transition = false;

  constructor(
    public navCtrl: NavController,
    public ref: ChangeDetectorRef,
    public navParams: NavParams,
    public chatIO: ChatIOService,
    public global: GlobalService,
    public userservice: OnlineUserService
  ) {
    this.userid = this.global.userinfo._id;
    this.friendid = navParams.get('userid');
    this.friendName = navParams.get('friendname');
    this.loadUserInfo(this.friendid);

    if (this.friendid && !this.friendName) {
      this.isFriend = false;
    } else {
      this.isFriend = true;
    }
  }

  loadUserInfo(friendid) {
    this.userservice.getUserByID(friendid).subscribe(data => {
      this.friendName = data.displayName || data.username;
      this.bio = data.bio;
    });
  }

  ionViewDidLoad() {
    this.headerImgUrl = 'assets/tomatobang.jpg';
  }

  /**
   * 查看番茄钟
   */
  toFriendTomatoes() {
    this.navCtrl.push('FriendTomatoesPage', {
      friendName: this.friendName,
    });
  }

  /**
   * 请求添加好友
   */
  reqAddFriend() {
    if (this.friendid && this.userid !== this.friendid) {
      this.chatIO.send_friend_request(this.userid, this.friendid);
      this.chatIO.requestAddFriendSuccess().subscribe(data => {
        console.log('friendinfo: requestAddFriendSuccess', data);
      });
    }
  }

  /**
   * 跳转至聊天页
   */
  toChatPage() {
    this.navCtrl.push('Chat', {
      toUserId: this.friendid,
      toUserName: this.friendName,
    });
  }

  toMore() {}

  onScroll($event: any) {
    // 只对苹果有效
    const scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 120;
    if (scrollTop < 0) {
      this.transition = false;
      this.headerImgSize = `${Math.abs(scrollTop) / 2 + 100}%`;
    } else {
      this.transition = true;
      this.headerImgSize = '100%';
    }
    this.ref.detectChanges();
  }
}
