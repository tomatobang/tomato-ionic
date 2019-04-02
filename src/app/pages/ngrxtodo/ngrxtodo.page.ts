import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './redux/ngrxtodo.reducer';
import * as TodoActions from './redux/todo/todo.actions';
import { OnlineTodoService } from '@services/data.service';
import { RegularTodoComponent } from './regular-todo/regular-todo.component';
import { EmitService } from '@services/emit.service';

@Component({
  selector: 'page-ngrxtodo-module',
  templateUrl: './ngrxtodo.page.html',
  styleUrls: ['ngrxtodo.page.scss']
})
export class NgRxTodoComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private todoservice: OnlineTodoService,
    private modalCtrl: ModalController,
    private emitService: EmitService,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.populateTodos();
    }, 20);
    this.emitService.getActiveUser().subscribe(ret => {
      this.populateTodos();
    });
  }

  private populateTodos() {
    this.todoservice.getTodos().subscribe(ret => {
      this.store.dispatch(new TodoActions.PopulateTodosAction(ret));
    });

  }

  async showRegularTodos() {
    const modal = await this.modalCtrl.create({
      component: RegularTodoComponent
    });
    modal.onDidDismiss().then(() => {

    });
    await modal.present();
  }
}
