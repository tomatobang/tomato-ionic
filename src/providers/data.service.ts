/*
 * 后台请求服务
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { baseUrl } from '../config';
import { CacheService } from './cache.service';

export * from './data/task';
export * from './data/tomato';
export * from './data/user';
export * from './data/user_friend';

@Injectable()
export class DataService {
  baseUrl: string = baseUrl;
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  });

  constructor(public http: HttpClient, public cacheService: CacheService) {}

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
}
