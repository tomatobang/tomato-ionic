import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ChatSocket } from './config/chat';
// import { Message } from '../../data/message/message.model';

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
   * 登出
   */
  logout(userid: string) {
    this.socket.emit('logout', { userid, endname: 'ionic' });
  }

  /**
   * 接收消息
   */
  receive_message() {
    return this.socket.fromEvent<any>('message_received').map(data => data);
  }

  /**
   * 发送消息
   */
  send_message(from: string, to: string, message: string) {
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
      .fromEvent<any>('online_friendlist_received')
      .map(data => data);
  }

  /**
   * 好友请求
   */
  send_friend_request(from: string, to: string) {
    this.socket.emit('request_add_request', {
      from,
      to,
      endname: 'ionic',
    });
  }

  /**
   * 好友请求发送成功
   */
  requestAddFriendSuccess() {
    return this.socket
      .fromEvent<any>('requestAddFriend_success')
      .map(data => data);
  }

  /**
   * 回复好友请求
   */
  response_friend_request(recordId: string, from: string, to: string, state) {
    this.socket.emit('response_friend_request', {
      recordId,
      from,
      to,
      state,
      endname: 'ionic',
    });
  }

  /**
   * 回复好友请求发送成功
   */
  responseAddFriendSuccess() {
    return this.socket
      .fromEvent<any>('responseAddFriend_success')
      .map(data => data);
  }

  /**
   * 添加新好友
   */
  new_added_friend() {
    return this.socket.fromEvent<any>('new_added_friend').map(data => data);
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
