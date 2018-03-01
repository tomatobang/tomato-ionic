import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';

import { UserInfo } from './chat-userinfo.model';
import { ChatMessage } from './chat-message.model';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ChatService {
  constructor(public http: HttpClient, public events: Events) {}

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
