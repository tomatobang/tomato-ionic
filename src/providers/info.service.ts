import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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

  public messageSubject: Subject<any> = new ReplaySubject<any>();
  public get newMessagesMonitor(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  public messagCountSubject: Subject<any> = new BehaviorSubject<any>(null);
  public get messageCountMonitor(): Observable<any> {
    return this.messagCountSubject.asObservable();
  }

  public realtimeMsgSubject: Subject<any> = new BehaviorSubject<any>(null);
  public get realtimeMsgMonitor(): Observable<any> {
    return this.realtimeMsgSubject.asObservable();
  }

  public realtimeMsgListSubject: Subject<any> = new Subject<any>();
  public get realtimeMsgListMonitor(): Observable<any> {
    return this.realtimeMsgListSubject.asObservable();
  }

  /**
   * 初始化消息服务
   */
  public init() {
    this.loadUnreadMsg();
    this.loadHistoryMsg();
    this.chatIO.receive_message().subscribe(data => {
      this.cache.addRealTimeFriendMsg(data._id, data);
      if (this.chatingNow) {
        this.realtimeMsgSubject.next(data);
      }
      this.realtimeMsgListSubject.next(data);
      this.unreadMsgCount += 1;
      this.messagCountSubject.next(this.unreadMsgCount);
    });
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
        this.unreadMsgCount = count;
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
      this.cache.setMessageSyncTime(new Date().getTime());
      this.messageService.getUnreadMessages(messageSyncTime).subscribe(data => {
        if (data) {
          let count = 0;
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            count += element.count;
            // 存储好友消息
            this.cache.setFriendMsg(element._id, element);
          }
          // 发布总数
          this.unreadMsgCount += count;
          this.messagCountSubject.next(this.unreadMsgCount);
          this.messageSubject.next(data);
          this.unreadMessage = this.unreadMessage.concat(data);
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
}
