import { Subject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { baseUrl, qiniuDomain } from '../config';

const subject: Subject<any> = new Subject<any>();
const tokenSubject: Subject<any> = new Subject<any>();
const settingSubject: Subject<any> = new Subject<any>();

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  public notificationSubject: Subject<any> = new Subject<any>();
  public serverAddress = baseUrl;
  public qiniuDomain = qiniuDomain;
  private _isActive = false;
  private _isFirstTimeOpen: boolean;
  private _token: string;
  private _userinfo: any;
  private _jpushAlias: any;
  private _countdown = 0;
  private _resttime = 0;
  private _isAlwaysLight;
  private _isAllowEditPicture;
  private _isAllowRememberLastbill;
  private _languageType;
  private _todoAutoAddTime: Date;

  constructor(public events: Events) { }

  public bioUpdate(bio: String) {
    this.events.publish('bio:update', bio);
  }

  public get projectChangeMonitor(): Observable<any> {
    return this.notificationSubject.asObservable();
  }
  /**
   * 配置改变
   */
  public get settingState(): Observable<any> {
    return settingSubject.asObservable();
  }

  get appIsActive() {
    return this._isActive;
  }

  set appIsActive(value) {
    this._isActive = value;
  }

  public get userinfostate(): Observable<any> {
    return subject.asObservable();
  }

  public get tokenState(): Observable<any> {
    return tokenSubject.asObservable();
  }

  /**
   * authorization token
   */
  get token() {
    if (this._token) {
      return this._token;
    } else {
      return localStorage.getItem('token');
    }
  }
  set token(value) {
    this._token = value;
    localStorage.setItem('token', value);
    tokenSubject.next(value);
  }

  get jpushAlias() {
    if (this._jpushAlias) {
      return this._jpushAlias;
    } else {
      const jpushaliasStr = localStorage.getItem('jpushalias');
      if (jpushaliasStr) {
        try {
          this._jpushAlias = JSON.parse(jpushaliasStr);
          return this._jpushAlias;
        } catch (error) {
          return null;
        }
      } else {
        return null;
      }
    }
  }

  set jpushAlias(value: any) {
    if (typeof value === 'string') {
      if (value === '') {
        this._jpushAlias = null;
        localStorage.removeItem('jpushalias');
      } else {
        this._jpushAlias = JSON.parse(value);
        localStorage.setItem('jpushalias', value);
      }
    } else if (typeof value === 'object') {
      this._jpushAlias = value;
      localStorage.setItem('jpushalias', JSON.stringify(value));
    }

    subject.next(value);
  }

  get userinfo() {
    if (this._userinfo) {
      return this._userinfo;
    } else {
      const userStr = localStorage.getItem('userinfo');
      if (userStr) {
        try {
          this._userinfo = JSON.parse(userStr);
          return this._userinfo;
        } catch (error) {
          return null;
        }
      } else {
        return null;
      }
    }
  }

  set userinfo(value: any) {
    if (typeof value === 'string') {
      if (value === '') {
        this._userinfo = null;
        localStorage.removeItem('userinfo');
      } else {
        this._userinfo = JSON.parse(value);
        localStorage.setItem('userinfo', value);
      }
    } else if (typeof value === 'object') {
      this._userinfo = value;
      localStorage.setItem('userinfo', JSON.stringify(value));
    }

    subject.next(value);
  }

  get isFirstTimeOpen() {
    if (this._isFirstTimeOpen) {
      return this._isFirstTimeOpen;
    } else {
      const isFirstTimeOpen = localStorage.getItem('isFirstTimeOpen');
      if (!isFirstTimeOpen || isFirstTimeOpen === 'true') {
        return true;
      } else {
        return false;
      }
    }
  }

  set todoAutoAddTime(value: Date) {
    this._todoAutoAddTime = value;
    localStorage.setItem('todoAutoAddTime', value.toLocaleDateString());
  }

  get todoAutoAddTime() {
    if (this._todoAutoAddTime) {
      return this._todoAutoAddTime;
    } else {
      const todoAutoAddTime = localStorage.getItem('todoAutoAddTime');
      if (todoAutoAddTime) {
        this._todoAutoAddTime = new Date(todoAutoAddTime);
        return this._todoAutoAddTime;
      } else {
        return null;
      }
    }
  }

  set isFirstTimeOpen(value) {
    this._isFirstTimeOpen = value;
    let str = '';
    if (value) {
      str = 'true';
    } else {
      str = 'false';
    }
    localStorage.setItem('isFirstTimeOpen', str);
  }

  get isAlwaysLight() {
    if (this._isAlwaysLight) {
      return this._isAlwaysLight;
    } else {
      const isAlwaysLight = localStorage.getItem('isAlwaysLight');
      if (isAlwaysLight === 'true') {
        this._isAlwaysLight = true;
      } else {
        this._isAlwaysLight = false;
      }
      return this._isAlwaysLight;
    }
  }

  set isAlwaysLight(value: boolean) {
    this._isAlwaysLight = value;
    let str = '';
    if (value) {
      str = 'true';
    } else {
      str = 'false';
    }
    localStorage.setItem('isAlwaysLight', str);
  }

  get isAllowEditPicture() {
    if (this._isAllowEditPicture) {
      return this._isAllowEditPicture;
    } else {
      const isAllowEditPicture = localStorage.getItem('isAllowEditPicture');
      if (isAllowEditPicture === 'false') {
        this._isAllowEditPicture = false;
      } else {
        this._isAllowEditPicture = true;
      }
      return this._isAllowEditPicture;
    }
  }

  set isAllowEditPicture(value: boolean) {
    this._isAllowEditPicture = value;
    let str = '';
    if (value) {
      str = 'true';
    } else {
      str = 'false';
    }
    localStorage.setItem('isAllowEditPicture', str);
  }

  get isAllowRememberLastbill() {
    if (this._isAllowRememberLastbill) {
      return this._isAllowRememberLastbill;
    } else {
      const isAllowRememberLastbill = localStorage.getItem('isAllowRememberLastbill');
      if (isAllowRememberLastbill === 'false') {
        this._isAllowRememberLastbill = false;
      } else {
        this._isAllowRememberLastbill = true;
      }
      return this._isAllowRememberLastbill;
    }
  }

  set isAllowRememberLastbill(value: boolean) {
    this._isAllowRememberLastbill = value;
    let str = '';
    if (value) {
      str = 'true';
    } else {
      str = 'false';
    }
    localStorage.setItem('isAllowRememberLastbill', str);
  }

  get languageType() {
    if (this._languageType) {
      return this._languageType;
    } else {
      const languageType = localStorage.getItem('languageType');
      this._languageType = languageType;
      return languageType;
    }
  }
  set languageType(value: string) {
    this._languageType = value;
    localStorage.setItem('languageType', value);
  }

  /**
   * 打开通知
   * @param data
   */
  openNotificationCallback(data) {
    this.notificationSubject.next({
      type: 'open',
      data: data,
    });
  }

  /**
   * 收到通知
   * @param data
   */
  receiveNotificationCallback(data) {
    this.notificationSubject.next({
      type: 'receive',
      data: data,
    });
  }

  /**
   * 设置别名
   * @param data
   */
  setTagsWithAliasCallback(data) {
    this.notificationSubject.next({
      type: 'setAlias',
      data: data,
    });
  }

  get countdown() {
    if (this._countdown !== 0) {
      return this._countdown;
    } else {
      const countdownStr = localStorage.getItem('_countdown');
      if (countdownStr) {
        return parseInt(countdownStr, 10);
      } else {
        return 25;
      }
    }
  }

  set countdown(value: number) {
    this._countdown = value;
    localStorage.setItem('_countdown', value + '');
    settingSubject.next({
      countdown: this._countdown,
      resttime: this._resttime,
    });
  }

  get resttime() {
    if (this._resttime !== 0) {
      return this._resttime;
    } else {
      const restStr = localStorage.getItem('_resttime');
      if (restStr) {
        return parseInt(restStr, 10);
      } else {
        return 5;
      }
    }
  }

  set resttime(value: number) {
    this._resttime = value;
    localStorage.setItem('_resttime', value + '');
    settingSubject.next({
      countdown: this._countdown,
      resttime: this._resttime,
    });
  }
}
