import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../redux/ngrxtodo.reducer';
import * as TodoActions from './../redux/todo/todo.actions';
import { OnlineTodoService } from '@services/data.service';
import { RegularTodoPopoverComponent } from './regular-todo-popover/regular-todo-popover.component';

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
              type: 1,
              auto_add: false
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
      if (ret && ret.data && ret.data.delete) {
        this.todoService.deleteRegularTodo(item._id).subscribe(ret => {
          this.regularTodos.splice(index, 1);
        });
      }
      if (ret && ret.data && ret.data.isChecked !== undefined) {
        this.regularTodos[index].auto_add = ret.data.isChecked;
        // TODO:
      }

      if (ret && ret.data && ret.data.todoType !== undefined) {
        this.regularTodos[index].type = window.parseInt(ret.data.todoType, 10);
        // TODO:
      }

    })
    await popover.present();
  }

  addTodo(item, type) {
    const title: string = item.title;
    item.added = true;
    const action = new TodoActions.AddTodoAction(title.trim(), type);
    this.store.dispatch(action);
  }

  closeModal() {
    this.modal.dismiss();
  }

}
