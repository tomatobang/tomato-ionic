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

  regularTodos = [
    { title: '八杯水', added: false },
    { title: '上午运动 20 min', added: false },
    { title: '下午运动 20 min', added: false },
    { title: '日常肩颈活动', added: false },
    { title: '提纲运动', added: false },
    { title: '眼保健操', added: false },
    { title: '站立办公', added: false },
    { title: '读纸质书半小时', added: false },
    { title: '家人电话', added: false },
  ];

  constructor(
    private modal: ModalController,
    private alertCtrl: AlertController,
    private store: Store<AppState>,
    private todoService: OnlineTodoService) {
  }

  ngOnInit() {
  }

  getRegularTodo() {
    this.todoService.getRegularTodo().subscribe(ret => {

    });
  }

  async createRegularTodo(ev: any) {
    const prompt = await this.alertCtrl.create({
      header: '输入番茄钟名称',
      inputs: [
        {
          name: 'title',
          placeholder: '输入...',
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {
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

            });
          },
        },
      ],
    });
    await prompt.present();
  }

  deleteRegularTodo(id) {
    this.todoService.deleteRegularTodo(id).subscribe(ret => {

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
