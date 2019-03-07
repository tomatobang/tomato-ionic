import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../redux/ngrxtodo.reducer';
import * as TodoActions from './../redux/todo/todo.actions';

@Component({
  selector: 'app-regular-todo',
  templateUrl: './regular-todo.component.html',
  styleUrls: ['./regular-todo.component.scss'],
})
export class RegularTodoComponent implements OnInit {

  regularTodos = [
    { title: '早上三杯水', added:false },
    { title: '下午三杯水', added:false },
    { title: '上午运动 20 min', added:false },
    { title: '下午运动 20 min', added:false },
    { title: '提纲运动', added:false },
    { title: '眼保健操', added:false },
    { title: '站立办公', added:false },
    { title: '家人电话', added:false },
  ];

  constructor(private modal: ModalController, private store: Store<AppState>) {

  }

  ngOnInit() {
  }

  addTodo(item) {
    const title: string = item.title;
    item.added = true;
    const action = new TodoActions.AddTodoAction(title.trim());
    this.store.dispatch(action);
  }

  closeModal() {
    this.modal.dismiss();
  }

}
