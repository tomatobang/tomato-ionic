import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { OnlineTodoService } from '@services/data.service';
import { AddTodoAction, ADD_TODO, ADD_TODO_SUCCEED, ADD_TODO_FAILED } from './todo.actions';
import { Todo } from './todo.model';

@Injectable()
export class TodoEffects {
    @Effect()
    addtodo$: Observable<Action> = this.actions$.pipe(
        ofType<AddTodoAction>(ADD_TODO),
        map((action: AddTodoAction) => action.text),
        mergeMap(async title => {
            let params;
            params = {
                title: title,
                type: 1,
                tag: '',
            };
            // this.apiService.createTodo(params).subscribe(res => {
            //     if (res.status === 'success') {
            //         this.store$.dispatch({
            //             type: ADD_TODO_SUCCEED,
            //             payload: res,
            //         });
            //     } else {
            //         this.store$.dispatch({
            //             type: ADD_TODO_FAILED,
            //             payload: res,
            //         });
            //     }
            // });

            setTimeout(() => {
                this.store$.dispatch({
                    type: ADD_TODO_SUCCEED,
                    payload: {
                        id: new Date().getTime(),
                        text: title,
                    },
                });
            }, 3000);
            return { type: '[todo]todo no_use' };
        })
    );

    constructor(
        private actions$: Actions,
        private store$: Store<Todo>,
        private apiService: OnlineTodoService
    ) { }
}
