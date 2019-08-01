import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
import { TodoService } from './abstract/todo.abstract';
import { Todo } from './model/todo.model';
import { TodoRegular } from './model/todoRegular.model';

@Injectable({
  providedIn: 'root'
})
export class OnlineTodoService extends TodoService {
  constructor(
    protected http: HttpClient,
    protected rebirthHttpProvider: RebirthHttpProvider
  ) {
    super(http);
  }

  @POST(baseUrl + 'api/todo/')
  createTodo(@Body todo: Todo): Observable<any> {
    return null;
  }
  @POST(baseUrl + 'api/todoregular/')
  createRegularTodo(@Body todo: TodoRegular): Observable<any> {
    return null;
  }

  @GET(baseUrl + 'api/todo')
  getTodos(
    @Query('date') date = new Date(),
    @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10,
    @Query('keyword') keyword?: string
  ): Observable<Array<Todo>> {
    return null;
  }
  @GET(baseUrl + 'api/todoregular')
  getRegularTodo(
    @Query('type') type = 1,
    @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10,
    @Query('keyword') keyword?: string
  ): Observable<Array<TodoRegular>> {
    return null;
  }

  @GET(baseUrl + 'api/todo/:id')
  getTodoByTitle(@Path('id') todoTitle: string): Observable<Todo> {
    return null;
  }

  @POST(baseUrl + 'api/todo/:id')
  updateTodo(@Path('id') id: string, @Body todo: Todo): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/todoregular/:id')
  updateRegularTodo(@Path('id') id: string, @Body todo: TodoRegular): Observable<any> {
    return null;
  }

  @DELETE(baseUrl + 'api/todo/:id')
  deleteTodo(@Path('id') id: string): Observable<any> {
    return null;
  }
  @DELETE(baseUrl + 'api/todoregular/:id')
  deleteRegularTodo(@Path('id') id: string): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/todo/toggleall')
  toggelAllTodo(@Body data): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/todo/deletecomplete')
  deleteAllCompletedTodo(): Observable<any> {
    return null;
  }

  @POST(baseUrl + 'api/todo/statistics')
  statistics(@Body data: { date }): Observable<any> {
    return null;
  }
}

export const TODO_SERVICE_PROVIDERS: Array<any> = [
  {
    provide: TodoService,
    useClass: OnlineTodoService,
  },
];
