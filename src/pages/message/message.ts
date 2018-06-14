import { Component, OnInit } from '@angular/core';

import { NavController, IonicPage } from 'ionic-angular';
import { UserFriendState } from '@providers/data/user_friend/model/state.enum';
import { GlobalService } from '@providers/global.service';
import { ChatIOService } from '@providers/utils/socket.io.service';
import { UserFriendService } from '@providers/data/user_friend';

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
      info: '我是李四',
      portrait: '',
      state: 1,
    },
    {
      id: '1',
      name: '王五',
      friendid: '',
      info: '我是王五',
      portrait: '',
      state: 1,
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
    this.userFriendService
      .getFriends(UserFriendState.SendRequest)
      .subscribe(data => {
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          if (element.to._id === this.userid) {
            this.messageList.push({
              id: element._id,
              state: element.state,
              name: element.from.displayName
                ? element.from.displayName
                : element.from.username,
              friendid: element.from._id,
              info: element.info ? element.info : '',
              portrait: '',
            });
          }
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
