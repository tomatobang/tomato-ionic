/*
 * 后台数据请求服务
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as querystring from 'querystring';
import { Cacheable } from './offlinecache.service';

import { baseUrl } from '../config';
import { NativeService } from './native.service';

export * from './data/task';
export * from './data/tomato';
export * from './data/user';
export * from './data/user_friend';
export * from './data/todo';
export * from './data/footprint';
export * from './data/bill';
export * from './data/asset';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(public http: HttpClient, public native: NativeService) { }
  public get TasksMonitor(): Observable<any> {
    return this.taskSubject.asObservable();
  }
  public get TomatoesMonitor(): Observable<any> {
    return this.tomatoesSubject.asObservable();
  }
  baseUrl: string = baseUrl;
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  });

  public taskSubject: Subject<any> = new BehaviorSubject<any>(null);

  public tomatoesSubject: Subject<any> = new BehaviorSubject<any>(null);

  amapHttpUtil(url: string, options: Object): Observable<Object> {
    const params = new HttpParams({
      fromString: querystring.stringify(options),
    });
    return this.http.get(url, {
      headers: this.headers,
      params: params,
    });
  }

  @Cacheable({ pool: 'test' })
  testCachedData(): Observable<any> {
    const obs = Observable.create(observer => {
      setTimeout(() => {
        observer.next(Math.random());
        observer.complete();
      }, 10);
    });
    obs.pipe(
      map(res => {
        return res;
      })
    );
    return obs;
  }

  taskChange(obj) {
    this.taskSubject.next(obj);
  }

  tomatoeschange(obj) {
    this.tomatoesSubject.next(obj);
  }
}
