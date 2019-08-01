import { ModalController, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../redux/ngrxtodo.reducer';
import * as TodoActions from './../redux/todo/todo.actions';
import { OnlineTodoService } from '@services/data.service';
import { RegularTodoPopoverComponent } from './regular-todo-popover/regular-todo-popover.component';
import { RegularTodoFormPopoverComponent } from './regular-todo-form-popover/regular-todo-form-popover';

declare var window;

@Component({
  selector: 'app-regular-todo',
  templateUrl: './regular-todo.component.html',
  styleUrls: ['./regular-todo.component.scss'],
})
export class RegularTodoComponent implements OnInit {

  regularTodos: any[] = [];

  constructor(
    private modal: ModalController,
    private popover: PopoverController,
    private store: Store<AppState>,
    private todoService: OnlineTodoService) {
  }

  ngOnInit() {
    this.getRegularTodo();
  }

  getRegularTodo() {
    this.todoService.getRegularTodo().subscribe(ret => {
      if (ret) {
        this.regularTodos = [];
        for (let index = 0; index < ret.length; index++) {
          const element = ret[index];
          this.regularTodos.push({
            _id: element._id,
            type: element.type,
            title: element.title,
            auto_add: element.auto_add,
            added: false
          });
        }
      }
    });
  }

  async createRegularTodo(ev: any) {

    const popover = await this.popover.create({
      component: RegularTodoFormPopoverComponent,
      componentProps: {
      },
      cssClass: 'statistic-popover'
    });
    popover.onDidDismiss().then(ret => {
      console.log(ret.data);
      if (ret && ret.data) {
        this.todoService.createRegularTodo({
          title: ret.data.title,
          type: ret.data.type,
          auto_add: ret.data.auto_add
        }).subscribe(ret => {
          if (ret) {
            this.regularTodos.push({
              _id: ret._id,
              title: ret.title,
              added: false
            });
          }
        });
      }
    })
    await popover.present();
  }

  async showPopover(item, index) {
    const popover = await this.popover.create({
      component: RegularTodoPopoverComponent,
      componentProps: {
        isChecked: item.auto_add ? true : false,
        todoType: item.type + '',
      },
      cssClass: 'statistic-popover'
    });
    popover.onDidDismiss().then(ret => {
      console.log(ret.data);
      if (ret && ret.data) {
        if (ret.data.delete) {
          this.todoService.deleteRegularTodo(item._id).subscribe(ret => {
            this.regularTodos.splice(index, 1);
          });
          return;
        }
        if (ret.data.isChecked !== undefined && item.auto_add !== ret.data.isChecked) {
          item.auto_add = ret.data.isChecked;
          this.todoService.updateRegularTodo(item._id, item).subscribe(ret => {
            console.log(ret);
          });
        }
        const todoType = window.parseInt(ret.data.todoType, 10);
        if (ret.data.todoType !== undefined && item.type !== todoType) {
          item.type = todoType;
          this.todoService.updateRegularTodo(item._id, item).subscribe(ret => {
            console.log(ret);
          });
        }
      }
    })
    await popover.present();
  }

  addTodo(item) {
    const title: string = item.title;
    item.added = true;
    const action = new TodoActions.AddTodoAction(title.trim(), item.type);
    this.store.dispatch(action);
  }

  closeModal() {
    this.modal.dismiss();
  }

}
