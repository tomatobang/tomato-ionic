import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Content, IonicPage } from 'ionic-angular';
import { OnlineUserService } from '@providers/data.service';
import { ChatIOService } from '@providers/utils/socket.io.service';
import { GlobalService } from '@providers/global.service';

@IonicPage()
@Component({
  selector: 'page-searchUserPage',
  templateUrl: 'searchUserPage.html',
  providers: [OnlineUserService],
})
export class SearchUserPage implements OnInit {
  searchReturnItems = [];
  userid;

  constructor(
    public userservice: OnlineUserService,
    public navParams: NavParams,
    public chatIO: ChatIOService,
    public global: GlobalService
  ) {}

  ionViewDidLoad() {}

  ngOnInit(): void {
    this.userid = this.global.userinfo.userid;
  }

  seachUsers(evt) {
    const keywords = evt.target.value;
    if (keywords && keywords.trim() !== '') {
      this.userservice.searchUsers(keywords).subscribe(data => {
        // TODO: 按 自己/已是好友/已发请求 几种状态进行处理
        this.searchReturnItems = data;
      });
    }
  }

  requestFriend(friendid, i) {
    if (friendid && this.userid !== friendid) {
      this.searchReturnItems[i].hasAdd = true;
      this.chatIO.send_friend_request(this.userid, friendid);
      this.chatIO.requestAddFriendSuccess().subscribe(data => {
        console.log('searchUserPage: requestAddFriendSuccess', data);
      });
    }
  }
}
