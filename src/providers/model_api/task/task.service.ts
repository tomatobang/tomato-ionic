import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Task } from './task.model';
import { SearchResult } from './search-result.model';
import { Observable } from 'rxjs/Observable';
import { Cacheable } from 'rebirth-storage/dist/rebirth-storage';
import { RebirthHttp, RebirthHttpProvider, GET, POST, DELETE, Query, Path, Body } from 'rebirth-http/rebirth-http';


export abstract class TaskService extends RebirthHttp {

  abstract createTask(task: Task): Observable<any>;

  abstract getTasks(pageIndex: any, pageSize: any, keyword?: string): Observable<SearchResult<Task>>;

  abstract getTaskByTitle(taskTitle: string): Observable<Task>;

  abstract updateTask(taskUrl: string, task: Task): Observable<any>;

  abstract deleteTask(taskUrl: string): Observable<any>;
}


@Injectable()
export class OnlineTaskService extends TaskService {

  constructor(protected http: Http, protected rebirthHttpProvider: RebirthHttpProvider) {
    super();
  }


  @POST('http://115.29.51.196:5555/api/task/')
  createTask( @Body task: Task): Observable<any> {
    return null;
  }

  // @Cacheable({ pool: 'tasks' })
  @GET('http://115.29.51.196:5555/api/task')
  getTasks( @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10,
    @Query('keyword') keyword?: string): Observable<SearchResult<Task>> {
    return null;
  }

  @GET('http://115.29.51.196:5555/api/task/:id')
  getTaskByTitle( @Path('id') taskTitle: string): Observable<Task> {
    return null;
  }

  @POST('http://115.29.51.196:5555/api/task/:id')
  updateTask( @Path('id') taskUrl: string, @Body task: Task): Observable<any> {
    return null;
  }

  @DELETE('http://115.29.51.196:5555/api/task/:id')
  deleteTask( @Path('id') taskUrl: string): Observable<any> {
    return null;
  }

}

export const TASK_SERVICE_PROVIDERS: Array<any> = [
  {
    provide: TaskService,
    // environment.deploy === 'github' ? GithubTaskService : OnlineTaskService
    useClass: OnlineTaskService
  }
];

