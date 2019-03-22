import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GlobalService } from './global.service';
import { UserFriendService } from '@services/data/user_friend';
import { UserFriendState } from '@services/data/user_friend/model/state.enum';
import { Storage } from '@ionic/Storage';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  userid;
  friendlist;

  constructor(
    public globalService: GlobalService,
    public userFriendService: UserFriendService,
    public storage: Storage
  ) {}

  /**
   * 清除缓存
   */
  clearCache() {
    this.storage.clear();
    this.friendlist = null;
  }

  /**
   * 获取好友列表
   */
  getFriendList(): Observable<any> {
    this.userid = this.globalService.userinfo._id;
    if (this.friendlist) {
      return new Observable(responseObserver => {
        responseObserver.next(this.friendlist);
        responseObserver.complete();
      });
    } else {
      return new Observable(responseObserver => {
        this.userFriendService
          .getFriends(UserFriendState.Agreed)
          .subscribe(data => {
            this.friendlist = [];
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
              if (element.to._id === this.userid) {
                this.friendlist.push({
                  id: element.from._id,
                  name: element.from.displayName
                    ? element.from.displayName
                    : element.from.username,
                  headImg: './assets/tomato-active.png',
                });
              } else {
                this.friendlist.push({
                  id: element.to._id,
                  name: element.to.displayName
                    ? element.to.displayName
                    : element.to.username,
                  headImg: './assets/tomato-active.png',
                });
              }
            }
            responseObserver.next(this.friendlist);
            responseObserver.complete();
          });
      });
    }
  }

  /**
   * 获取所有好友聊天记录
   * @param fid 好友编号
   */
  public getAllFriendMsg(): Observable<any> {
    const ret = [];
    return new Observable(responseObserver => {
      this.storage
        .forEach((value: any, key: string) => {
          if (key.startsWith('friend:message:')) {
            ret.push(value);
          }
        })
        .then(() => {
          responseObserver.next(ret);
          responseObserver.complete();
        });
    });
  }

  /**
   * 获取好友聊天记录
   * @param fid 好友编号
   */
  public getFriendMsg(fid): Observable<any> {
    return new Observable(responseObserver => {
      this.storage.get('friend:message:' + fid).then(data => {
        if (data) {
          responseObserver.next(data.messages ? data.messages : []);
          responseObserver.complete();
        }
      });
    });
  }

  /**
   * 本地存储好友聊天记录
   * @param fid 好友编号
   * @param data 聊天记录
   */
  public setFriendMsg(fid, data) {
    this.storage.get('friend:message:' + fid).then(sdata => {
      if (sdata) {
        const newdata = sdata;
        newdata.count += data.count;
        newdata.messages = newdata.messages.concat(data.messages);
        this.storage.set('friend:message:' + fid, newdata);
      } else {
        this.storage.set('friend:message:' + fid, data);
      }
    });
  }

  /**
   * 本地存储好友聊天记录
   * @param fid 好友编号
   * @param data 聊天记录
   */
  public addRealTimeFriendMsg(fid, data) {
    this.storage.get('friend:message:' + fid).then(sdata => {
      if (sdata) {
        const newdata = sdata;
        if (fid === data.from && !data.has_read) {
          newdata.count += 1;
        }
        newdata.messages.push(data);
        this.storage.set('friend:message:' + fid, newdata);
      } else {
        const newdata = { count: 1, _id: fid, messages: [] };
        if (fid === data.from || data.has_read) {
          newdata.count = 0;
        }
        newdata.messages.push(data);
        this.storage.set('friend:message:' + fid, newdata);
      }
    });
  }

  /**
   * 消息置为已读
   * @param fid
   */
  updateMessageState(fid) {
    this.storage.get('friend:message:' + fid).then(sdata => {
      if (sdata) {
        const newdata = sdata;
        newdata.count = 0;
        const array = newdata.messages;
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          element.has_read = true;
        }
        this.storage.set('friend:message:' + fid, newdata);
      }
    });
  }

  /**
   * 获取消息同步时间
   */
  public getMessageSyncTime(): Observable<any> {
    return new Observable(responseObserver => {
      this.storage.get('message_sync_time').then(data => {
        responseObserver.next(data);
        responseObserver.complete();
      });
    });
  }

  /**
   * 设置消息同步时间
   * @param datetime 日期
   */
  public setMessageSyncTime(datetime) {
    return this.storage.set('message_sync_time', datetime);
  }

  private _clone(object: any) {
    if (object) {
      return JSON.parse(JSON.stringify(object));
    } else {
      return null;
    }
  }
}
