import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './redux/ngrxtodo.reducer';
import * as TodoActions from './redux/todo/todo.actions';
import { OnlineTodoService } from '@services/data.service';
import { RebirthHttpProvider } from 'rebirth-http';
import { GlobalService } from '@services/global.service';

@Component({
  selector: 'page-ngrxtodo-module',
  templateUrl: './ngrxtodo.page.html',
  styleUrls: ['ngrxtodo.page.scss']
})
export class NgRxTodoComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private service: OnlineTodoService,
    private globalservice: GlobalService,
    private rebirthProvider: RebirthHttpProvider
  ) {
    this.rebirthProvider.headers({ Authorization: this.globalservice.token }, true);
  }

  ngOnInit() {
    this.populateTodos();
  }

  private populateTodos() {
    this.service.getTodos().subscribe(ret => {
      this.store.dispatch(new TodoActions.PopulateTodosAction(ret));
    });

  }

  backTolist() {
    this.router.navigateByUrl('tabs/list');
  }
}
