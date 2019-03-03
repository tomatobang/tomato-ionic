import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { OnlineTodoService } from '@services/data.service';
import { AppState } from '../ngrxtodo.reducer';
import {
    AddTodoAction, ToggleAction,
    DeleteTodoAction, ToggleAllAction,
    ClearCompletedAction, UpdateAction,
    ADD_TODO, ADD_TODO_SUCCEED,
    TOGGLE_TODO, TOGGLE_TODO_SUCCEED,
    DELETE_TODO, DELETE_TODO_SUCCEED,
    TOGGLE_ALL_TODO, TOGGLE_ALL_TODO_SUCCEED,
    CLEAR_COMPLETED_TODO, CLEAR_COMPLETED_TODO_SUCCEED,
    UPDATE_TODO, UPDATE_TODO_SUCCEED
} from './todo.actions';


@Injectable()
export class TodoEffects {
    @Effect()
    addtodo$: Observable<Action> = this.actions$.pipe(
        ofType<AddTodoAction>(ADD_TODO),
        map((action: AddTodoAction) => action.title),
        mergeMap(async title => {
            let params;
            params = {
                title: title,
                type: 1,
            };
            this.apiService.createTodo(params).subscribe(res => {
                this.store$.dispatch({
                    type: ADD_TODO_SUCCEED,
                    payload: res,
                });
            });

            return { type: '[todo]todo no_use' };
        })
    );

    @Effect()
    toggletodo$: Observable<Action> = this.actions$.pipe(
        ofType<ToggleAction>(TOGGLE_TODO),
        map((action: ToggleAction) => action.todo),
        mergeMap(async todo => {
            todo.completed = !todo.completed;
            this.apiService.updateTodo(todo._id, todo).subscribe(res => {
                this.store$.dispatch({
                    type: TOGGLE_TODO_SUCCEED,
                    _id: todo._id,
                });
            });
            return { type: '[todo]todo no_use' };
        })
    );

    @Effect()
    deletetodo$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteTodoAction>(DELETE_TODO),
        map((action: DeleteTodoAction) => action._id),
        mergeMap(async _id => {
            this.apiService.deleteTodo(_id).subscribe(res => {
                this.store$.dispatch({
                    type: DELETE_TODO_SUCCEED,
                    _id: _id,
                });
            });
            return { type: '[todo]todo no_use' };
        })
    );

    @Effect()
    updatetodo$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateAction>(UPDATE_TODO),
        map((action: UpdateAction) => action),
        mergeMap(async action => {
            setTimeout(() => {
                this.store$.dispatch({
                    type: UPDATE_TODO_SUCCEED,
                    _id: action._id,
                    title: action.title,
                });
            }, 1000);
            return { type: '[todo]todo no_use' };
        })
    );

    @Effect()
    togglealltodo$: Observable<Action> = this.actions$.pipe(
        ofType<ToggleAllAction>(TOGGLE_ALL_TODO),
        map((action: ToggleAllAction) => action.complete),
        mergeMap(async complete => {
            setTimeout(() => {
                this.store$.dispatch({
                    type: TOGGLE_ALL_TODO_SUCCEED,
                    complete: complete,
                });
            }, 1000);
            return { type: '[todo]todo no_use' };
        })
    );

    @Effect()
    clearcompletetodo$: Observable<Action> = this.actions$.pipe(
        ofType<ClearCompletedAction>(CLEAR_COMPLETED_TODO),
        map((action: ClearCompletedAction) => action),
        mergeMap(async action => {
            setTimeout(() => {
                this.store$.dispatch({
                    type: CLEAR_COMPLETED_TODO_SUCCEED,
                });
            }, 1000);
            return { type: '[todo]todo no_use' };
        })
    );
    constructor(
        private actions$: Actions,
        private store$: Store<AppState>,
        private apiService: OnlineTodoService
    ) { }
}
