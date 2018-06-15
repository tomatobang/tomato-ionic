import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import * as querystring from 'querystring';
import { baseUrl } from '../config';

import { MessageService } from './data/message/message.service';

@Injectable()
export class InfoService {
  baseUrl: string = baseUrl;
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  });

  constructor(public http: HttpClient, public messageService: MessageService) {}

  public messageSubject: Subject<any> = new BehaviorSubject<any>(null);
  public get newMessagesMonitor(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  public messagCountSubject: Subject<any> = new BehaviorSubject<any>(null);
  public get messageCountMonitor(): Observable<any> {
    return this.messagCountSubject.asObservable();
  }

  /**
   * 初始化消息服务
   */
  public init() {
    // 加载所有未读消息（先从本地加载 --> 从服务端加载 ）
    // 对消息进行分组( 按照好友 )
    // 不断接收新消息
    // 可以对消息是否已读的状态进行设置
    this.messageService.getUnreadMessages().subscribe(data => {
      if (data) {
        let count = 0;
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          count += data[index].count;
        }
        // 发布总数
        this.messagCountSubject.next(count);
        this.messageSubject.next(data);
      }
    });
  }
}
