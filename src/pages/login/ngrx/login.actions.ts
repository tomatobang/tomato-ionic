import { Action } from '@ngrx/store';

export enum LoginActionTypes {
  LOGIN = '[login] login',
  LOGINSUCCESS = '[login] login success',
  LOGINFAILED = '[login] login failed',
}

export class Login implements Action {
  readonly type = LoginActionTypes.LOGIN;
  constructor(public payload: any) {}
}

export class Succeed implements Action {
  readonly type = LoginActionTypes.LOGINSUCCESS;
  constructor(public payload: any) {}
}

export class Failed implements Action {
  readonly type = LoginActionTypes.LOGINFAILED;

  constructor(public payload: any) {}
}

export type LoginActionsUnion = Login | Succeed | Failed;
