import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {
  RebirthHttpProvider,
  GET,
  POST,
  DELETE,
  Query,
  Path,
  Body,
} from 'rebirth-http';
import { baseUrl } from '../../../config';

import { TaskService } from './abstract/task.abstract';
import { Task } from './model/task.model';

@Injectable()
export class OnlineTaskService extends TaskService {
  constructor(
    protected http: HttpClient,
    protected rebirthHttpProvider: RebirthHttpProvider
  ) {
    super(http);
  }

  @POST(baseUrl + 'api/task/')
  createTask(@Body task: Task): Observable<any> {
    return null;
  }

  @GET(baseUrl + 'api/task')
  getTasks(
    @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10,
    @Query('keyword') keyword?: string
  ): Observable<Array<Task>> {
    return null;
  }

  @GET(baseUrl + 'api/task/:id')
  getTaskByTitle(@Path('id') taskTitle: string): Observable<Task> {
    return null;
  }

  @POST(baseUrl + 'api/task/:id')
  updateTask(@Path('id') taskUrl: string, @Body task: Task): Observable<any> {
    return null;
  }

  @DELETE(baseUrl + 'api/task/:id')
  deleteTask(@Path('id') taskUrl: string): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/task/updateVoiceUrl')
  updateVoiceUrl(@Body data: { taskid: string; relateUrl: string }): Observable<any> {
    return null;
  }
}

export const TASK_SERVICE_PROVIDERS: Array<any> = [
  {
    provide: TaskService,
    useClass: OnlineTaskService,
  },
];
