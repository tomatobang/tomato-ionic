import { Action } from '@ngrx/store';
import { Todo } from './todo.model';

export const ADD_TODO = '[TODO] add';
export const ADD_TODO_SUCCEED = '[TODO] add succeed';
export const ADD_TODO_FAILED = '[TODO] add failed';
export const DELETE_TODO = '[TODO] delete';
export const TOGGLE_TODO = '[TODO] toggle';
export const UPDATE_TODO = '[TODO] update';
export const POPULATE_TODOS = '[TODO] populate';
export const CLEAR_COMPLETED_TODO = '[TODO] clear completed';
export const COMPLETE_ALL_TODO = '[TODO] complete all';

export class AddTodoAction implements Action {
  readonly type = ADD_TODO;
  public id: number;

  constructor(
    public text: string
  ) {
    this.id = Math.random();
  }
}

export class AddTodoSucceedAction implements Action {
  readonly type = ADD_TODO_SUCCEED;
  constructor(public payload: any) { }
}

export class AddTodoFailedAction implements Action {
  readonly type = ADD_TODO_FAILED;
  constructor(public payload: any) { }
}

export class PopulateTodosAction implements Action {
  readonly type = POPULATE_TODOS;

  constructor(
    public todos: Todo[]
  ) { }
}

export class DeleteTodoAction implements Action {
  readonly type = DELETE_TODO;

  constructor(
    public id: number
  ) { }
}

export class ToggleAction implements Action {
  readonly type = TOGGLE_TODO;

  constructor(
    public id: number
  ) { }
}

export class UpdateAction implements Action {
  readonly type = UPDATE_TODO;

  constructor(
    public id: number,
    public text: string,
  ) { }
}

export class ClearCompletedAction implements Action {
  readonly type = CLEAR_COMPLETED_TODO;
}

export class CompletedAllAction implements Action {
  readonly type = COMPLETE_ALL_TODO;
}

export type TodoActionType =
  AddTodoSucceedAction |
  AddTodoFailedAction |
  AddTodoAction |
  PopulateTodosAction |
  ToggleAction |
  DeleteTodoAction |
  UpdateAction |
  ClearCompletedAction |
  CompletedAllAction;
