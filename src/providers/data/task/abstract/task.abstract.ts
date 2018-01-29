import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Cacheable } from 'rebirth-storage';
import {
  RebirthHttp
} from 'rebirth-http';

import { Task } from '../model/task.model';
import { SearchResult } from '../model/search-result.model';

export abstract class TaskService extends RebirthHttp {
    abstract createTask(task: Task): Observable<any>;

    abstract getTasks(
      pageIndex: any,
      pageSize: any,
      keyword?: string
    ): Observable<SearchResult<Task>>;

    abstract getTaskByTitle(taskTitle: string): Observable<Task>;

    abstract updateTask(taskUrl: string, task: Task): Observable<any>;

    abstract deleteTask(taskUrl: string): Observable<any>;
  }
