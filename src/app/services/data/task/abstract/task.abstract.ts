import { Observable } from 'rxjs';
import { RebirthHttp } from 'rebirth-http';

import { Task } from '../model/task.model';

export abstract class TaskService extends RebirthHttp {
  abstract createTask(task: Task): Observable<any>;

  abstract getTasks(
    pageIndex: any,
    pageSize: any,
    keyword?: string
  ): Observable<Array<Task>>;

  abstract getTaskByTitle(taskTitle: string): Observable<Task>;

  abstract updateTask(taskUrl: string, task: Task): Observable<any>;

  abstract deleteTask(taskUrl: string): Observable<any>;
}
