import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { chatSocketUrl } from '../../../config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatIOService {
  socket: Socket;
  hasConnected = false;
  userid;

  constructor() { }

  /**
   * 断线重连
   */
  reconnect() {
    this.socket.connect();
    setTimeout(() => {
      if (!this.hasConnected) {
        this.reconnect();
      }
    }, 5000);
  }

  /**
   * 登录
   */
  login(userid: string, token) {
    this.userid = userid;
    if (!this.socket) {
      this.socket = new Socket({
        url: chatSocketUrl,
        options: {
          query: 'token=' + token,
        },
      });
      this.socket.on('connect', () => {
        this.hasConnected = true;
        if (this.userid) {
          this.login(this.userid, token);
        }
      });
      this.socket.on('disconnect', () => {
        this.hasConnected = false;
        this.reconnect();
      });
      this.socket.on('verify_failed', () => {
      });
    }

    console.log('ChatIOService login');
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
    return this.socket.fromEvent<any>('message_received').pipe(map(data => data));
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
      .pipe(map(data => data));
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
      .pipe(map(data => data));
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
      .pipe(map(data => data));
  }

  /**
   * 添加新好友
   */
  new_added_friend() {
    return this.socket.fromEvent<any>('new_added_friend').pipe(map(data => data));
  }

  /**
   * 好友在线
   */
  friend_online() {
    return this.socket.fromEvent<any>('friend_online').pipe(map(data => data));
  }

  /**
   * 好友离线
   */
  friend_offline() {
    return this.socket.fromEvent<any>('friend_offline').pipe(map(data => data));
  }

  /**
   * 服务端错误消息
   */
  fail() {
    return this.socket.fromEvent<any>('fail').pipe(map(data => data));
  }
}
