import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './redux/ngrxtodo.reducer';
import * as TodoActions from './redux/todo/todo.actions';
import { OnlineTodoService } from '@services/data.service';
import { RebirthHttpProvider } from 'rebirth-http';
import { GlobalService } from '@services/global.service';
import { RegularTodoComponent } from './regular-todo/regular-todo.component';

@Component({
  selector: 'page-ngrxtodo-module',
  templateUrl: './ngrxtodo.page.html',
  styleUrls: ['ngrxtodo.page.scss']
})
export class NgRxTodoComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private todoservice: OnlineTodoService,
    private globalservice: GlobalService,
    private rebirthProvider: RebirthHttpProvider,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.rebirthProvider.headers({ Authorization: this.globalservice.token }, true);
    setTimeout(() => {
      this.populateTodos();
    }, 20);
  }

  private populateTodos() {
    this.todoservice.getTodos().subscribe(ret => {
      this.store.dispatch(new TodoActions.PopulateTodosAction(ret));
    });

  }

  backTolist() {
    this.router.navigateByUrl('tabs/list');
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
