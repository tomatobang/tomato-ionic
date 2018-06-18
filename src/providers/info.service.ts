import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import * as querystring from 'querystring';
import { baseUrl } from '../config';

import { MessageService } from './data/message/message.service';
import { ChatIOService } from '@providers/utils/socket.io.service';

@Injectable()
export class InfoService {
  unreadMsgCount = 0;
  chatingNow;
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  });

  constructor(
    public http: HttpClient,
    public messageService: MessageService,
    public chatIO: ChatIOService
  ) {}

  public messageSubject: Subject<any> = new BehaviorSubject<any>(null);
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

  public realtimeMsgListSubject: Subject<any> = new BehaviorSubject<any>(null);
  public get realtimeMsgListMonitor(): Observable<any> {
    return this.realtimeMsgListSubject.asObservable();
  }

  /**
   * 初始化消息服务
   */
  public init() {
    this.messageService.getUnreadMessages().subscribe(data => {
      if (data) {
        let count = 0;
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          count += data[index].count;
        }
        // 发布总数
        this.unreadMsgCount = count;
        this.messagCountSubject.next(this.unreadMsgCount);
        this.messageSubject.next(data);
      }
    });

    this.chatIO.receive_message().subscribe(data => {
      if (this.chatingNow) {
        this.realtimeMsgSubject.next(data);
      }
      this.realtimeMsgListSubject.next(data);
      this.unreadMsgCount += 1;
      this.messagCountSubject.next(this.unreadMsgCount);
    });
  }

  registerChatMsg(userid) {
    this.chatingNow = userid;
  }
}
