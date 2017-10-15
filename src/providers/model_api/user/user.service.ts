import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User,EmailUserName } from './user.model';
import { SearchResult } from './search-result.model';
import { Observable } from 'rxjs/Observable';
import { Cacheable } from 'rebirth-storage';
import { RebirthHttp, RebirthHttpProvider, GET, POST, DELETE, Query, Path, Body } from 'rebirth-http';
import { baseUrl } from '../../../config'

export abstract class UserService extends RebirthHttp {

  abstract getUsers(pageIndex:any, pageSize:any, keyword?: string): Observable<SearchResult<User>>;

  abstract getUserByTitle(userName: string): Observable<User>;

  abstract updateUser(userUrl: string, user: User): Observable<any> ;

  abstract  deleteUser(userUrl: string): Observable<any> ;

  abstract  register(user: User): Observable<any> ;

  abstract  login(user: User): Observable<any> ;

  abstract  verifyUserNameEmail(email: EmailUserName): Observable<any> ;
}


@Injectable()
export class OnlineUserService extends UserService {

  constructor(protected http: Http, protected rebirthHttpProvider: RebirthHttpProvider) {
    super();
  }

  @Cacheable({ pool: 'users' })
  @GET(baseUrl+'api/user')
  getUsers(@Query('pageIndex') pageIndex = 1,
              @Query('pageSize') pageSize = 10,
              @Query('keyword') keyword?: string): Observable<SearchResult<User>> {
    return null;
  }

  @GET(baseUrl+'api/user/:id')
  getUserByTitle(@Path('id') userName: string): Observable<User> {
    return null;
  }

  @POST(baseUrl+'api/user/:id')
  updateUser(@Path('id') userUrl: string, @Body user: User): Observable<any> {
    return null;
  }

  @DELETE(baseUrl+'api/user/:id')
  deleteUser(@Path('id') userUrl: string): Observable<any> {
    return null;
  }

  @POST(baseUrl+'api/user')
  register( @Body user: User): Observable<any> {
    return null;
  }


  @POST(baseUrl+'api/login/')
  login( @Body user: User): Observable<any> {
    return null;
  }


  @POST(baseUrl+'email_username/verify')
  verifyUserNameEmail(@Body email_username: EmailUserName): Observable<any> {
    return null;
  }

}


export const USER_SERVICE_PROVIDERS: Array<any> = [
  {
    provide: UserService,
    // environment.deploy === 'github' ? GithubUserService : OnlineUserService
    useClass: OnlineUserService 
  }
];

