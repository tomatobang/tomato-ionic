import { Component, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { ChatIOService } from '@services/utils/socket.io.service';
import { GlobalService } from '@services/global.service';
import { OnlineUserService } from '@services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'page-friendinfo',
  templateUrl: 'friendinfo.html',
  styleUrls: ['friendinfo.scss'],
})
export class FriendInfoPage implements OnInit {
  friendid;
  friendName = '';
  headImg;
  userid;
  bio = '';
  location = '';
  isFriend = false;

  showToolbar = false;
  headerImgSize = '100%';
  headerImgUrl = '';
  transition = false;

  constructor(
    private ref: ChangeDetectorRef,
    private chatIO: ChatIOService,
    private global: GlobalService,
    private userservice: OnlineUserService,
    private navCtrl: NavController,
    private actrouter: ActivatedRoute,

  ) {
    this.userid = this.global.userinfo._id;
    this.actrouter.queryParams.subscribe((queryParams) => {
      if (queryParams && queryParams['userid']) {
        this.friendid = queryParams['userid'];
        this.friendName = queryParams['friendname'];
        this.headImg = queryParams['headImg'];
      }
      this.loadUserInfo(this.friendid);
      if (this.friendid && !this.friendName) {
        this.isFriend = false;
      } else {
        this.isFriend = true;
      }
    });
  }

  ngOnInit() {
    this.headerImgUrl = 'assets/tomatobang.jpg';
  }


  loadUserInfo(friendid) {
    this.userservice.getUserByID(friendid).subscribe(data => {
      this.friendName = data.displayName || data.username;
      this.bio = data.bio;
      this.location = data.location ? data.location : '未知';
    });
  }

  /**
   * 查看番茄钟
   */
  toFriendTomatoes() {
    this.navCtrl.navigateForward(['tabs/friend/friendtomato'], {
      queryParams: {
        friendid: this.friendid,
        friendName: this.friendName,
        headImg: this.headImg
      }
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
    this.navCtrl.navigateForward(['tabs/friend/message/chat'], {
      queryParams: {
        toUserId: this.friendid,
        toUserName: this.friendName,
        friendHeadImg: this.headImg
      }
    });
  }

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

  toMore() {
    alert('coming soon~');
  }
}
