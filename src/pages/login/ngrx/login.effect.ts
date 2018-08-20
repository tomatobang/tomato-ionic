import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { OnlineUserService } from '@providers/data.service';
import { LoginActionTypes, Login } from './login.actions';
import { State } from './login.reducer';

@Injectable()
export class LoginEffects {
  @Effect()
  login$: Observable<Action> = this.actions$.pipe(
    ofType<Login>(LoginActionTypes.LOGIN),
    map((action: Login) => action.payload),
    mergeMap(async val => {
      this.apiService.login(val).subscribe(res => {
        if (res.status === 'success') {
          this.store$.dispatch({
            type: LoginActionTypes.LOGINSUCCESS,
            payload: res,
          });
        } else {
          this.store$.dispatch({
            type: LoginActionTypes.LOGINFAILED,
            payload: res,
          });
        }
      });
      return { type: '[login] login no_use' };
    })
  );

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private apiService: OnlineUserService
  ) {}
}
