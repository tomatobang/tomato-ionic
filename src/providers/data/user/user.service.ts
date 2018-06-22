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

import { UserService } from './abstract/user.abstract';
import { EmailUserName } from './model/email-username.model';
import { User } from './model/user.model';
import { SearchResult } from './model/search-result.model';

@Injectable()
export class OnlineUserService extends UserService {
  constructor(
    protected http: HttpClient,
    protected rebirthHttpProvider: RebirthHttpProvider
  ) {
    super(http);
  }

  @Cacheable({ pool: 'users' })
  @GET(baseUrl + 'api/user')
  getUsers(
    @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10,
    @Query('keyword') keyword?: string
  ): Observable<SearchResult<User>> {
    return null;
  }

  @GET(baseUrl + 'api/user/auth')
  auth(): Observable<any> {
    return null;
  }

  @GET(baseUrl + 'api/user/searchUsers')
  searchUsers(
    @Query('keyword') keyword?: string,
    @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10
  ): Observable<Array<User>> {
    return null;
  }

  @GET(baseUrl + 'api/user/:id')
  getUserByTitle(@Path('id') userName: string): Observable<User> {
    return null;
  }

  @POST(baseUrl + 'api/user/:id')
  updateUser(@Path('id') userUrl: string, @Body user: User): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/user')
  register(@Body user: User): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/login/')
  login(@Body user: User): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'email_username/verify')
  verifyUserNameEmail(@Body email_username: EmailUserName): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/user/headimg')
  updateUserHeadImg(@Body
  data: {
    userid: string;
    filename: string;
  }): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/user/sex')
  updateSex(@Body data: { userid: string; sex: string }): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/user/displayname')
  updateDisplayName(@Body
  data: {
    userid: string;
    displayname: string;
  }): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/user/email')
  updateEmail(@Body data: { userid: string; email: string }): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/user/location')
  updateLocation(@Body data: { userid: string; location: string }): Observable<
    any
  > {
    return null;
  }

  @POST(baseUrl + 'api/user/bio')
  updateBio(@Body data: { userid: string; bio: string }): Observable<any> {
    return null;
  }
}

export const USER_SERVICE_PROVIDERS: Array<any> = [
  {
    provide: UserService,
    // environment.deploy === 'github' ? GithubUserService : OnlineUserService
    useClass: OnlineUserService,
  },
];
