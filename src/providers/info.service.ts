import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';

import { MessageService } from './data/message/message.service';
import { ChatIOService } from '@providers/utils/socket.io.service';
import { CacheService } from '@providers/cache.service';

@Injectable()
export class InfoService {
  unreadMsgCount = 0;
  chatingNow;
  unreadMessage = [];
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  });

  constructor(
    public http: HttpClient,
    public messageService: MessageService,
    public chatIO: ChatIOService,
    public cache: CacheService
  ) {}

  public messageSubject: Subject<any> = new ReplaySubject<any>(2);
  public get newMessagesMonitor(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  public messagCountSubject: Subject<any> = new ReplaySubject<any>(null);
  public get messageCountMonitor(): Observable<any> {
    return this.messagCountSubject.asObservable();
  }

  public singleMessagCountSubject: Subject<any> = new ReplaySubject<any>(null);
  public get singleMessageCountMonitor(): Observable<any> {
    return this.singleMessagCountSubject.asObservable();
  }

  public realtimeMsgListSubject: Subject<any> = new ReplaySubject<any>();
  public get realtimeMsgListMonitor(): Observable<any> {
    return this.realtimeMsgListSubject.asObservable();
  }

  public realtimeMsgSubject: Subject<any> = new Subject<any>();
  public get realtimeMsgMonitor(): Observable<any> {
    return this.realtimeMsgSubject.asObservable();
  }

  /**
   * 初始化消息服务
   */
  public init() {
    this.loadUnreadMsg();
    this.loadHistoryMsg();
    this.chatIO.receive_message().subscribe(data => {
      this.cache.setMessageSyncTime(new Date(data.create_at).getTime());
      if (this.chatingNow) {
        data.has_read = true;
        this.realtimeMsgSubject.next(data);
      } else {
        this.unreadMsgCount += 1;
      }
      this.cache.addRealTimeFriendMsg(data.from, {
        from: data.from,
        to: data.to,
        content: data.content,
        type: data.type,
        create_at: data.create_at,
        has_read: data.has_read,
      });

      this.realtimeMsgListSubject.next(data);
      this.messagCountSubject.next(this.unreadMsgCount);
    });
  }

  /**
   * 同步本地消息至缓存与消息列表
   * @param fid 好友编号
   * @param msg 消息
   */
  syncMsgFromLocal(fid, msg) {
    this.cache.addRealTimeFriendMsg(fid, msg);
    this.realtimeMsgListSubject.next(msg);
  }

  /**
   * 消息状态置为已读
   * @param fid
   */
  updateMessageState(fid) {
    this.cache.updateMessageState(fid);
  }

  /**
   * 加载历史消息
   */
  loadHistoryMsg() {
    this.cache.getAllFriendMsg().subscribe(data => {
      if (data) {
        let count = 0;
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          count += element.count;
        }
        // 发布总数
        this.unreadMsgCount += count;
        this.messagCountSubject.next(this.unreadMsgCount);
        this.messageSubject.next(data);
        this.unreadMessage = data;
      }
    });
  }

  /**
   * 或许好友消息列表
   * @param fid 好友编号
   */
  getFriendHistoryMsg(fid) {
    return this.cache.getFriendMsg(fid);
  }

  /**
   * 加载未读消息
   */
  loadUnreadMsg() {
    this.cache.getMessageSyncTime().subscribe(messageSyncTime => {
      if (messageSyncTime) {
        messageSyncTime = new Date(messageSyncTime);
      }

      this.messageService.getUnreadMessages(messageSyncTime).subscribe(data => {
        const messages = data.messages;
        const lst_create_at = data.lst_create_at;
        if (messages) {
          this.cache.setMessageSyncTime(new Date(lst_create_at).getTime());
          let count = 0;
          for (let index = 0; index < messages.length; index++) {
            const element = messages[index];
            count += element.count;
            // 存储好友消息
            this.cache.setFriendMsg(element._id, element);
          }
          // 发布总数
          this.unreadMsgCount += count;
          this.messagCountSubject.next(this.unreadMsgCount);
          this.messageSubject.next(messages);
          this.unreadMessage = this.unreadMessage.concat(messages);
        }
      });
    });
  }

  /**
   * 设置正在聊天的用户
   * @param userid 用户编号
   */
  registerChatMsg(userid) {
    this.chatingNow = userid;
  }

  /**
   * @deprecated
   * 获取用户未读消息列表
   * @param userid 用户编号
   */
  getUnreadHistoryMsg(userid) {
    if (this.unreadMessage) {
      for (let index = 0; index < this.unreadMessage.length; index++) {
        const element = this.unreadMessage[index];
        if (element._id === userid) {
          return element.messages;
        }
      }
    }
    return [];
  }

  /**
   * 设置未读消息数
   * @param val 未读消息数(+/-)
   * @param fid 好友编号
   */
  addUnreadMsgCount(val, fid) {
    this.unreadMsgCount += val;
    this.messagCountSubject.next(this.unreadMsgCount);
    this.singleMessagCountSubject.next(fid);
  }
}
