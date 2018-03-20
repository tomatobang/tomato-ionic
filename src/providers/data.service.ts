/*
 * 后台请求服务
 *
 *  get 示例
    getAlarmCount(options: Object): Observable<any> {
        let params: RequestOptions = this.interceptor()
        params.search = new URLSearchParams(querystring.stringify(options))
        return this.http.get(baseUrl + 'article/getFrontArticleList', params)
    }
 * JWT 示例
     const token = window.localStorage.getItem('token')
     if (token && !opts.headers.get('Authorization')) {
        opts.headers.append('Authorization','Bearer ' + token.replace(/(^\")|(\"$)/g, ''))
     }

 * POST 示例
    getTomatoes(userID): Observable<any> {
        var creds = "userID=" + userID + "&data1=1";
        return this.http.post(this.baseUrl + '.',
        creds, this.interceptor()).map(res => res.json());
    }
 *
 */
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import * as querystring from 'querystring';
import { baseUrl } from '../config';
import { CacheService } from './cache.service';

export * from './data/task';
export * from './data/tomato';
export * from './data/user';
export * from './data/user_friend';

@Injectable()
export class DataService {
  baseUrl: string = baseUrl;
  headers: HttpHeaders = new HttpHeaders();

  constructor(public http: HttpClient, public cacheService: CacheService) {
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }

  public taskSubject: Subject<any> = new BehaviorSubject<any>(null);
  public get TasksMonitor(): Observable<any> {
    return this.taskSubject.asObservable();
  }

  public tomatoesSubject: Subject<any> = new BehaviorSubject<any>(null);
  public get TomatoesMonitor(): Observable<any> {
    return this.tomatoesSubject.asObservable();
  }

  taskChange(obj) {
    this.taskSubject.next(obj);
  }

  tomatoeschange(obj) {
    this.tomatoesSubject.next(obj);
  }

  amapHttpUtil(url: string, options: Object): Observable<any> {
    const params = new HttpParams({
      fromString: querystring.stringify(options),
    });
    return this.http.get(url, {
      headers: this.headers,
      params: params,
    });
  }
}
