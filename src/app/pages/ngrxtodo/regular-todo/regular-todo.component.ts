import { ModalController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../redux/ngrxtodo.reducer';
import * as TodoActions from './../redux/todo/todo.actions';
import { OnlineTodoService } from '@services/data.service';

@Component({
  selector: 'app-regular-todo',
  templateUrl: './regular-todo.component.html',
  styleUrls: ['./regular-todo.component.scss'],
})
export class RegularTodoComponent implements OnInit {

  regularTodos: any[] = [];

  constructor(
    private modal: ModalController,
    private alertCtrl: AlertController,
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
            title: element.title,
            added: false
          });
        }
      }
    });
  }

  async createRegularTodo(ev: any) {
    const prompt = await this.alertCtrl.create({
      header: '输入TODO名称',
      inputs: [
        {
          name: 'title',
          placeholder: '输入...',
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: '提交',
          handler: data => {
            const title = data.title;
            this.todoService.createRegularTodo({
              title: title,
              type: 1
            }).subscribe(ret => {
              if (ret) {
                this.regularTodos.push({
                  _id: ret._id,
                  title: ret.title,
                  added: false
                });
              }
            });
          },
        },
      ],
    });
    await prompt.present();
  }

  deleteRegularTodo(id, index) {
    this.todoService.deleteRegularTodo(id).subscribe(ret => {
      this.regularTodos.splice(index, 1);
    })
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
