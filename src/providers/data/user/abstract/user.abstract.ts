import { Observable } from 'rxjs/Observable';

import { RebirthHttp } from 'rebirth-http';

import { EmailUserName } from '../model/email-username.model';
import { User } from '../model/user.model';
import { SearchResult } from '../model/search-result.model';

export abstract class UserService extends RebirthHttp {
  abstract getUsers(
    pageIndex: any,
    pageSize: any,
    keyword?: string
  ): Observable<SearchResult<User>>;

  abstract getUserByID(userName: string): Observable<User>;

  abstract updateUser(userUrl: string, user: User): Observable<any>;

  abstract register(user: User): Observable<any>;

  abstract login(user: User): Observable<any>;

  abstract verifyUserNameEmail(email: EmailUserName): Observable<any>;

  abstract updateUserHeadImg(data: {
    userid: string;
    filename: string;
  }): Observable<any>;

  abstract updateSex(data: { userid: string; sex: string }): Observable<any>;

  abstract updateSex(data: { userid: string; sex: string }): Observable<any>;

  abstract updateDisplayName(data: {
    userid: string;
    displayname: string;
  }): Observable<any>;

  abstract updateEmail(data: {
    userid: string;
    email: string;
  }): Observable<any>;

  abstract updateLocation(data: {
    userid: string;
    location: string;
  }): Observable<any>;

  abstract updateBio(data: { userid: string; bio: string }): Observable<any>;
}
