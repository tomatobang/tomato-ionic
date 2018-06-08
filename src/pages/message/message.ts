import { Component, OnInit } from '@angular/core';

import { NavController, IonicPage } from 'ionic-angular';
import { UserFriendService } from '@providers/data/user_friend';
import { GlobalService } from '@providers/global.service';
import { ChatIOService } from '@providers/utils/socket.io.service';

@IonicPage()
@Component({
  selector: 'cmp-message',
  templateUrl: 'message.html',
})
export class MessagePage implements OnInit {
  toUser: Object;
  showType = 'msg';
  userid;
  messageList = [
    {
      id: '1',
      name: '李四',
      friendid: '',
      info: '请求添加您为好友',
      portrait: '',
    },
    {
      id: '1',
      name: '王五',
      friendid: '',
      info: '请求添加您为好友',
      portrait: '',
    },
  ];

  constructor(
    public navCtrl: NavController,
    public userFriendService: UserFriendService,
    public globalservice: GlobalService,
    public chatIO: ChatIOService
  ) {
    this.toUser = {
      toUserId: '210000198410281948',
      toUserName: 'Hancock',
    };

    this.userid = globalservice.userinfo.userid;
  }

  ngOnInit(): void {
    this.getReqFriendList();
  }

  toChatPage() {
    console.log('setting!');
    this.navCtrl.push('Chat', this.toUser, {}, () => {});
  }

  getReqFriendList() {
    this.userFriendService.getFriends().subscribe(data => {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.to._id === this.userid) {
          this.messageList.push({
            id: element._id,
            name: element.from.displayName
              ? element.from.displayName
              : element.from.username,
            friendid: element.from._id,
            info: '请求添加您为好友',
            portrait: '',
          });
        }
        // if (element.from._id === this.userid) {
        //   this.messageList.push({
        //     id: element._id,
        //     name: element.to.displayName
        //       ? element.to.displayName
        //       : element.to.username,
        //     friendid: element.to._id,
        //     info: '正在等待对方回复',
        //     portrait: '',
        //   });
        // }
      }
      console.log(data);
    });
  }

  responseReq(id, friendid) {
    this.chatIO.response_friend_request(id, friendid, this.userid, 2);
    this.chatIO.responseAddFriendSuccess().subscribe(data => {
      console.log('responseAddFriendSuccess', data);
    });
  }
}
