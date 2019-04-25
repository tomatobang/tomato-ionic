import { Observable } from 'rxjs';
import { RebirthHttp } from 'rebirth-http';

import { Todo } from '../model/todo.model';
import { TodoRegular } from '../model/todoRegular.model';

export abstract class TodoService extends RebirthHttp {
  abstract createTodo(todo: Todo): Observable<any>;
  abstract createRegularTodo(todo: TodoRegular): Observable<any>;

  abstract getTodos(
    date: any,
    pageIndex: any,
    pageSize: any,
    keyword?: string
  ): Observable<Array<Todo>>;
  abstract getRegularTodo(
    type: any,
    pageIndex: any,
    pageSize: any,
    keyword?: string
  ): Observable<Array<TodoRegular>>;

  abstract updateTodo(todoUrl: string, todo: Todo): Observable<any>;

  abstract deleteTodo(todoUrl: string): Observable<any>;  
  abstract deleteRegularTodo(todoUrl: string): Observable<any>;

  abstract toggelAllTodo(data: any): Observable<any>;

  abstract deleteAllCompletedTodo(): Observable<any>;

  abstract statistics(data: { date }): Observable<any>;
}
