import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Cacheable } from 'rebirth-storage';
import {
  RebirthHttp,
  RebirthHttpProvider,
  GET,
  POST,
  DELETE,
  Query,
  Path,
  Body,
} from 'rebirth-http';
import { baseUrl } from '../../../config';

import { Message, MessageRet } from './message.model';

@Injectable()
export class MessageService extends RebirthHttp {
  constructor(
    protected http: HttpClient,
    protected rebirthHttpProvider: RebirthHttpProvider
  ) {
    super(http);
  }

  /**
   * 获取未读消息
   * @param state
   */
  @GET(baseUrl + 'api/message')
  getUnreadMessages(): Observable<MessageRet[]> {
    return null;
  }

  /**
   * 获取未读消息总数
   * @param data
   */
  @POST(baseUrl + 'api/message/count')
  getUnreadMessagesCount(@Body data: {}): Observable<any> {
    return null;
  }
}
