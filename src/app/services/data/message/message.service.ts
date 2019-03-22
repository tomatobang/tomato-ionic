import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  RebirthHttp,
  RebirthHttpProvider,
  GET,
  POST,
  Query,
  Body,
} from 'rebirth-http';
import { baseUrl } from '../../../config';

import { UnreadMessageRet } from './message.model';

@Injectable({
  providedIn: 'root',
})
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
  getUnreadMessages(
    @Query('startTime') startTime?
  ): Observable<UnreadMessageRet> {
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

  /**
   * 更新消息状态
   * @param data
   */
  @POST(baseUrl + 'api/message/updateReadState')
  updateMessageState(@Body data: { id; has_read }): Observable<any> {
    return null;
  }
}
