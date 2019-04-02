import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GlobalService } from '@services/global.service';
import { tomatoSocketUrl } from '../../../config';
import { Tomato } from '../../data/tomato';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class TomatoIOService {
  socket: Socket;
  hasConnected = false;
  userid;
  constructor(public g: GlobalService) { }

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
   * 第一次，用于加载当前tomato
   */
  load_tomato(userid: string) {
    this.userid = userid;
    if (!this.socket) {
      this.socket = new Socket({
        url: tomatoSocketUrl,
        options: {
          query: 'token=' + this.g.token,
        },
      });
      this.socket.on('connect', () => {
        this.hasConnected = true;
        if (this.userid) {
          this.load_tomato(this.userid);
        }
      });

      this.socket.on('disconnect', () => {
        this.hasConnected = false;
        this.reconnect();
      });
      this.socket.on('verify_failed', () => {
      });
    }
    this.socket.emit('load_tomato', { userid, endname: 'ionic' });
  }

  /**
   * 登出
   */
  logout(userid: string) {
    if (this.socket) {
      this.socket.emit('logout', { userid, endname: 'ionic' });
      this.socket = null;
    }
  }

  load_tomato_succeed() {
    return this.socket.fromEvent('load_tomato_succeed').pipe(map(data => data));
  }

  /**
   * 其它终端中断番茄钟
   */
  other_end_break_tomato() {
    return this.socket
      .fromEvent<any>('other_end_break_tomato')
      .pipe(map(data => data));
  }
  /**
   * 中断番茄钟
   */
  break_tomato(userid: string, tomato: Tomato) {
    this.socket.emit('break_tomato', {
      userid,
      endname: 'ionic',
      tomato,
    });
  }

  /**
   * 中断番茄钟
   */
  break_tomato_succeed() {
    this.socket.fromEvent<any>('break_tomato_succeed').pipe(map(data => data));
  }

  /**
   * 其它终端开启番茄钟
   */
  other_end_start_tomato() {
    return this.socket
      .fromEvent<any>('other_end_start_tomato')
      .pipe(map(data => data));
  }

  /**
   * 开启番茄钟
   */
  start_tomato(userid: string, tomato: Tomato, countdown: Number) {
    this.socket.emit('start_tomato', {
      userid,
      endname: 'ionic',
      tomato,
      countdown,
    });
  }

  /**
   * 开启番茄钟成功
   */
  start_tomato_succeed(tomato: Tomato) {
    this.socket.emit('start_tomato_succeed', tomato);
  }

  /**
   *
   */
  new_tomate_added() {
    return this.socket.fromEvent<any>('new_tomate_added').pipe(map(data => data));
  }
}
