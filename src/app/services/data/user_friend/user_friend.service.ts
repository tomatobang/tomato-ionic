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

import { UserFriend } from './model/user_friend.model';

@Injectable({
  providedIn: 'root',
})
export class UserFriendService extends RebirthHttp {
  constructor(
    protected http: HttpClient,
    protected rebirthHttpProvider: RebirthHttpProvider
  ) {
    super(http);
  }

  @GET(baseUrl + 'api/user_friend')
  getFriends(
    @Query('state') state: number,
  ): Observable<UserFriend[]> {
    return null;
  }

  @POST(baseUrl + 'api/user_friend/request_add_friend')
  requestAddFriend(@Body
  data: {
    from_userid: string;
    to_userid: string;
  }): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/user_friend/response_add_friend')
  responseAddFriend(@Body
  data: {
    recordId: string;
    state: string;
  }): Observable<any> {
    return null;
  }
}
