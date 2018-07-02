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
  showType = 'msg';

  userid;

  newMessages = [];
  userSet = new Map();
  messageList = [];

  constructor(
    public navCtrl: NavController,
    public userFriendService: UserFriendService,
    public globalservice: GlobalService,
    public chatIO: ChatIOService,
    public info: InfoService,
    public cache: CacheService
  ) {
    this.userid = globalservice.userinfo._id;
  }

  ngOnInit(): void {
    // 获取通知列表
    this.getReqFriendList();
    this.info.newMessagesMonitor.subscribe(data => {
      for (let index = data.length - 1; index >= 0; index--) {
        const element = data[index];
        if (this.userSet.has(element._id) && element.messages) {
          const i = this.userSet.get(element._id);
          this.newMessages[i].content =
            element.messages[element.messages.length - 1].content;
          this.newMessages[i].count += 1;
        } else {
          this.newMessages.push({
            fid: element._id,
            name: name,
            content: element.messages[element.messages.length - 1].content,
            count: element.count,
          });
          this.userSet.set(element._id, index);
          this.getFriendName(element._id).then(name => {
            const i = this.userSet.get(element._id);
            this.newMessages[i].name = name;
          });
        }
      }
    });

    // 监听实时消息
    this.info.realtimeMsgListMonitor.subscribe(data => {
      if (data) {
        let fid = data.from;
        let count = 1;
        if (data.from === this.userid) {
          fid = data.to;
          count = 0;
        }
        if (this.userSet.has(fid)) {
          const i = this.userSet.get(fid);
          this.newMessages[i].content = data.content
            ? data.content
            : data.content;
          this.newMessages[i].count += count;
        } else {
          this.newMessages.push({
            fid: fid,
            name: '',
            content: data.content,
            count: count,
          });
          this.userSet.set(fid, this.newMessages.length - 1);

          this.getFriendName(fid).then(name => {
            const i = this.userSet.get(fid);
            this.newMessages[i].name = name;
          });
        }
      }
    });

    this.info.singleMessageCountMonitor.subscribe(data => {
      const i = this.userSet.get(data);
      if (i >= 0) {
        this.newMessages[i].count = 0;
      }
    });
  }

  /**
   * 获取好友名称
   * @param id 好友编号
   */
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

  /**
   * 获取好友发起请求列表
   */
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

  /**
   * 同意好友请求
   * @param id 当前用户编号
   * @param friendid 好友编号
   */
  responseReq(id, friendid) {
    this.chatIO.response_friend_request(id, friendid, this.userid, 2);
    this.chatIO.responseAddFriendSuccess().subscribe(data => {
      console.log('responseAddFriendSuccess', data);
    });
  }
}
