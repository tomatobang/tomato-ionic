import { Component, OnInit } from '@angular/core';

import { NavController, IonicPage } from 'ionic-angular';
import { UserFriendState } from '@providers/data/user_friend/model/state.enum';
import { GlobalService } from '@providers/global.service';
import { ChatIOService } from '@providers/utils/socket.io.service';
import { UserFriendService } from '@providers/data/user_friend';
import { InfoService } from '@providers/info.service';
import { CacheService } from '@providers/cache.service';

@IonicPage()
@Component({
  selector: 'cmp-message',
  templateUrl: 'message.html',
})
export class MessagePage implements OnInit {
  toUser: Object;
  showType = 'msg';
  userid;

  newMessages = [];
  userSet = new Map();

  messageList = [
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
    public chatIO: ChatIOService,
    public info: InfoService,
    public cache: CacheService
  ) {
    this.toUser = {
      toUserId: '210000198410281948',
      toUserName: 'Hancock',
    };

    this.userid = globalservice.userinfo.userid;

    // 注册收到消息服务
    this.chatIO.receive_message().subscribe(data => {
      console.log('receiveMessage', data);
    });
  }

  ngOnInit(): void {
    // 获取通知列表
    this.getReqFriendList();
    // 监听新消息
    this.info.newMessagesMonitor.subscribe(data => {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (this.userSet.has(element._id)) {
          const i = this.userSet.get(element._id);
          this.newMessages[i].content = element.messages[0].content;
          this.newMessages[i].count += 1;
        } else {
          this.getFriendName(element._id).then(name => {
            this.newMessages.push({
              fid: element._id,
              name: name,
              content: element.messages[0].content,
              count: element.count,
            });
            this.userSet.set(element._id, index);
          });
        }
      }
    });
  }

  getFriendName(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cache.getFriendList().subscribe(friendList => {
        if (friendList) {
          for (let index = 0; index < friendList.length; index++) {
            const element = friendList[index];
            if (element.id === id) {
              resolve(element.name);
            }
          }
        }
        resolve('unknown');
      });
    });
  }

  /**
   * 跳转至聊天页
   * @param fid 好友编号
   * @param fname 好友名称
   */
  toChatPage(fid, fname) {
    console.log('toChatPage!');
    this.navCtrl.push('Chat', {
      toUserId: fid,
      toUserName: fname,
    });
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
