import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './redux/ngrxtodo.reducer';
import * as TodoActions from './redux/todo/todo.actions';
import { OnlineTodoService } from '@services/data.service';
import {
  getTodos,
} from './redux/todo/todo.selectors';

@Component({
  selector: 'page-ngrxtodo-module',
  templateUrl: './ngrxtodo.page.html',
  styleUrls: ['ngrxtodo.page.scss']
})
export class NgRxTodoComponent {
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private service: OnlineTodoService
  ) {
    this.populateTodos();
    this.updateTodos();
  }

  private populateTodos() {

    this.service.getTodos().subscribe(ret => {
      this.store.dispatch(new TodoActions.PopulateTodosAction(ret));
    });

  }

  private updateTodos() {
    this.store.pipe(select(getTodos)).subscribe(todos => {
      // todo
    });
  }

  backTolist() {
    this.router.navigateByUrl('tabs/list');
  }
}
