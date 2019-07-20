import { Observable } from 'rxjs';

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

  abstract changePWD(data: { oldPassword: string; newPassword: string }): Observable<any>;

  abstract register(user: User): Observable<any>;

  abstract login(user: User): Observable<any>;

  abstract verifyUserNameEmail(email: EmailUserName): Observable<any>;

  abstract updateUserHeadImg(data: {
    filename: string;
  }): Observable<any>;

  abstract updateSex(data: { userid: string; sex: string }): Observable<any>;

  abstract updateDisplayName(data: {
    displayname: string;
  }): Observable<any>;

  abstract updateEmail(data: {
    email: string;
  }): Observable<any>;

  abstract updateLocation(data: {
    location: string;
  }): Observable<any>;

  abstract updateBio(data: { userid: string; bio: string }): Observable<any>;
}
