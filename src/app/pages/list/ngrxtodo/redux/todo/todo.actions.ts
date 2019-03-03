import { Action } from '@ngrx/store';
import { Todo } from './todo.model';

export const ADD_TODO = '[TODO] add';
export const ADD_TODO_SUCCEED = '[TODO] add succeed';
export const ADD_TODO_FAILED = '[TODO] add failed';
export const DELETE_TODO = '[TODO] delete';
export const DELETE_TODO_SUCCEED = '[TODO] delete succeed';
export const TOGGLE_TODO = '[TODO] toggle';
export const TOGGLE_TODO_SUCCEED = '[TODO] toggle succeed';
export const UPDATE_TODO = '[TODO] update';
export const UPDATE_TODO_SUCCEED = '[TODO] update succeed';
export const POPULATE_TODOS = '[TODO] populate';
export const CLEAR_COMPLETED_TODO = '[TODO] clear completed';
export const CLEAR_COMPLETED_TODO_SUCCEED = '[TODO] clear completed succeed';
export const TOGGLE_ALL_TODO = '[TODO] complete all';
export const TOGGLE_ALL_TODO_SUCCEED = '[TODO] complete all succeed';


export class AddTodoAction implements Action {
  readonly type = ADD_TODO;
  public _id: string;

  constructor(
    public title: string
  ) {
    this._id = Math.random() + '';
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

export class ToggleAction implements Action {
  readonly type = TOGGLE_TODO;

  constructor(
    public todo: Todo
  ) { }
}
export class ToggleSucceedAction implements Action {
  readonly type = TOGGLE_TODO_SUCCEED;

  constructor(
    public _id: string
  ) { }
}

export class DeleteTodoAction implements Action {
  readonly type = DELETE_TODO;

  constructor(
    public _id: string
  ) { }
}

export class DeleteTodoSucceedAction implements Action {
  readonly type = DELETE_TODO_SUCCEED;

  constructor(
    public _id: string
  ) { }
}

export class UpdateAction implements Action {
  readonly type = UPDATE_TODO;

  constructor(
    public _id: string,
    public title: string,
  ) { }
}

export class UpdateSucceedAction implements Action {
  readonly type = UPDATE_TODO_SUCCEED;

  constructor(
    public _id: string,
    public title: string,
  ) { }
}

export class ClearCompletedAction implements Action {
  readonly type = CLEAR_COMPLETED_TODO;
}

export class ClearCompletedSucceedAction implements Action {
  readonly type = CLEAR_COMPLETED_TODO_SUCCEED;
}

export class ToggleAllAction implements Action {
  readonly type = TOGGLE_ALL_TODO;
  constructor(
    public complete: boolean,
  ) { }
}
export class ToggleAllSucceedAction implements Action {
  readonly type = TOGGLE_ALL_TODO_SUCCEED;
}


export type TodoActionType =
  AddTodoSucceedAction |
  AddTodoFailedAction |
  AddTodoAction |
  PopulateTodosAction |
  ToggleAction |
  ToggleSucceedAction |
  DeleteTodoAction |
  DeleteTodoSucceedAction |
  UpdateAction |
  UpdateSucceedAction |
  ClearCompletedAction |
  ClearCompletedSucceedAction |
  ToggleAllAction |
  ToggleAllSucceedAction;
