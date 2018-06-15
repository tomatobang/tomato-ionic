import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';

import { UserInfo } from './chat-userinfo.model';
import { ChatMessage } from './chat-message.model';

import 'rxjs/add/operator/toPromise';

import { ChatIOService } from '@providers/utils/socket.io.service';

@Injectable()
export class ChatService {
  constructor(
    public http: HttpClient,
    public events: Events,
    public chatIO: ChatIOService
  ) {}

  /**
   * 发送消息
   * @param from 自己
   * @param to 好友
   * @param message 消息
   */
  sendMessage(from: string, to: string, message: string) {
    this.chatIO.send_message(from, to, message);
  }

  mockNewMsg(msg) {
    setTimeout(() => {
      this.events.publish(
        'chat:received',
        {
          messageId: Date.now().toString(),
          userId: '210000198410281948',
          userName: 'Hancock',
          userImgUrl: './assets/to-user.jpg',
          toUserId: '140000198202211138',
          time: Date.now(),
          message: msg.message,
          status: 'success',
        },
        Date.now()
      );
    }, Math.random() * 1800);
  }

  getMsgList(): Observable<ChatMessage[]> {
    const msgListUrl = './assets/mock/msg-list.json';

    return this.http.get<any>(msgListUrl).pipe(map(response => response.array));
  }

  sendMsg(msg: ChatMessage) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(msg);
      }, Math.random() * 1000);
    }).then(() => {
      this.mockNewMsg(msg);
    });
  }

  getUserInfo(): Promise<UserInfo> {
    const userInfo: UserInfo = {
      userId: '140000198202211138',
      userName: 'Luff',
      userImgUrl: './assets/user.jpg',
    };
    return new Promise((resolve, reject) => {
      resolve(userInfo);
    });
  }
}
