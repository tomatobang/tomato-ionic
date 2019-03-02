import { Observable } from 'rxjs';
import { RebirthHttp } from 'rebirth-http';

import { Todo } from '../model/todo.model';

export abstract class TodoService extends RebirthHttp {
  abstract createTodo(todo: Todo): Observable<any>;

  abstract getTodos(
    pageIndex: any,
    pageSize: any,
    keyword?: string
  ): Observable<Array<Todo>>;

  abstract updateTodo(todoUrl: string, todo: Todo): Observable<any>;

  abstract deleteTodo(todoUrl: string): Observable<any>;
}
