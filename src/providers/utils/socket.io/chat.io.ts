import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ChatSocket } from './config/chat';
import { Message } from '../../data/message/message.model';

@Injectable()
export class ChatIOService {
  constructor(private socket: ChatSocket) {}

  /**
   * 登录
   */
  login(userid: string) {
    this.socket.emit('login', { userid, endname: 'ionic' });
  }

  /**
   * 接收消息
   */
  receive_message() {
    return this.socket.fromEvent<any>('receive_message').map(data => data);
  }

  /**
   * 发送消息
   */
  send_message(from: string, to: string, message: Message) {
    this.socket.emit('send_message', {
      from,
      to,
      message,
      endname: 'ionic',
    });
  }

  /**
   * 加载好友在线列表
   */
  load_online_friend_list(userid: string) {
    this.socket.emit('load_online_friend_list', { userid, endname: 'ionic' });
  }
  load_online_friend_list_succeed() {
    return this.socket
      .fromEvent<any>('load_online_friend_list_succeed')
      .map(data => data);
  }

  /**
   * 好友请求
   */
  send_friend_request(userid: string, state) {
    this.socket.emit('send_friend_request', {
      userid,
      state,
      endname: 'ionic',
    });
  }

  /**
   * 好友在线
   */
  friend_online() {
    return this.socket.fromEvent<any>('friend_online').map(data => data);
  }

  /**
   * 好友离线
   */
  friend_offline() {
    return this.socket.fromEvent<any>('friend_offline').map(data => data);
  }

  /**
   * 服务端错误消息
   */
  fail() {
    return this.socket.fromEvent<any>('fail').map(data => data);
  }
}