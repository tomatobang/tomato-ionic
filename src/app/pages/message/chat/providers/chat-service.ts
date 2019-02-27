import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Events } from '@ionic/angular';
import 'rxjs/add/operator/toPromise';

import { ChatIOService } from '@services/utils/socket.io.service';
import { ChatMessage } from './chat-message.model';


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

  /**
   * @mock
   * 模拟消息列表
   */
  getMsgList(): Observable<ChatMessage[]> {
    const msgListUrl = './assets/mock/msg-list.json';
    return this.http.get<any>(msgListUrl).pipe(map(response => response.array));
  }
}
