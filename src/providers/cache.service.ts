import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { GlobalService } from './global.service';
import { UserFriendService } from '@providers/data/user_friend';
import { UserFriendState } from '@providers/data/user_friend/model/state.enum';
import { Storage } from '@ionic/storage';

@Injectable()
export class CacheService {
  userid;
  friendlist;

  constructor(
    public globalService: GlobalService,
    public userFriendService: UserFriendService,
    public storage: Storage
  ) {
    this.userid = globalService.userinfo.userid;

    // TODO: 从本地存储中加载好友列表
  }

  /**
   * 获取好友列表
   */
  getFriendList(): Observable<any> {
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
              responseObserver.next(this.friendlist);
              responseObserver.complete();
            }
          });
      });
    }
  }

  private _clone(object: any) {
    if (object) {
      return JSON.parse(JSON.stringify(object));
    } else {
      return null;
    }
  }

  /**
   * 获取好友聊天记录
   * @param fid 好友编号
   */
  public getFriendMsg(fid): Observable<any> {
    return new Observable(responseObserver => {
      this.storage.get(fid).then(data => {
        responseObserver.next(data);
        responseObserver.complete();
      });
    });
  }

  /**
   * 本地存储好友聊天记录
   * @param fid 好友编号
   * @param data 聊天记录
   */
  public setFriendMsg(fid, data) {
    this.storage.set(fid, data);
  }
}
