import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './redux/ngrxtodo.reducer';
import * as TodoActions from './redux/todo/todo.actions';
import { RegularTodoComponent } from './regular-todo/regular-todo.component';
import { EmitService } from '@services/emit.service';
import { GlobalService } from '@services/global.service';
import { OnlineTodoService } from '@services/data.service';

import {
  getVisibleTodos,
} from './redux/todo/todo.selectors';

@Component({
  selector: 'page-ngrxtodo-module',
  templateUrl: './ngrxtodo.page.html',
  styleUrls: ['ngrxtodo.page.scss']
})
export class NgRxTodoComponent implements OnInit {
  todos;

  constructor(
    private store: Store<AppState>,
    private todoservice: OnlineTodoService,
    private modalCtrl: ModalController,
    private emitService: EmitService,
    private _global: GlobalService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.populateTodos();
    }, 20);
    this.emitService.getActiveUser().subscribe(ret => {
      this.populateTodos();
    });

    this.store.pipe(select(getVisibleTodos)).subscribe(todos => {
      this.todos = todos.sort((a, b) => a.type - b.type);
    });
  }

  private populateTodos() {
    let shouldAutoAdd = false;
    const todoAutoAddTime = this._global.todoAutoAddTime;
    if (!todoAutoAddTime || new Date(new Date().toLocaleDateString()).getTime() > todoAutoAddTime.getTime()) {
      shouldAutoAdd = true;
    }
    this.todoservice.getTodos().subscribe(todos => {
      if (shouldAutoAdd) {
        this.todoservice.getRegularTodo().subscribe(regularTodos => {
          regularTodos = regularTodos.filter((e) => e.auto_add === true);
          let autoAddList: any;
          autoAddList = regularTodos;
          for (let i = 0; i < autoAddList.length; i++) {
            const rtodo = autoAddList[i];
            for (let j = 0; j < todos.length; j++) {
              const todo = todos[j];
              if (rtodo.title === todo.title) {
                rtodo.shouldRemove = true;
              }
            }
          }
          for (let m = 0; m < autoAddList.length; m++) {
            const element = autoAddList[m];
            if (!element.shouldRemove) {
              const action = new TodoActions.AddTodoAction(element.title.trim(), element.type);
              this.store.dispatch(action);
            }
          }
          this._global.todoAutoAddTime = new Date();
        });
      }
      this.store.dispatch(new TodoActions.PopulateTodosAction(todos));
    });

  }

  refresh() {
    this.populateTodos();
  }

  async showRegularTodos() {
    const modal = await this.modalCtrl.create({
      component: RegularTodoComponent,
      componentProps: {
        todolist: this.todos ? this.todos : []
      }
    });
    modal.onDidDismiss().then(() => {

    });
    await modal.present();
  }
}
