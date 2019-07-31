import { AlertController, PopoverController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-regular-todo-popover',
  templateUrl: './regular-todo-popover.component.html',
  styleUrls: ['./regular-todo-popover.component.scss'],
})
export class RegularTodoPopoverComponent implements OnInit {
  @Input()
  isChecked: false;
  @Input()
  todoType
  
  constructor(
    private alertCtrl: AlertController,
    private popover: PopoverController
  ) {
  }

  ngOnInit() {
  }

  changeTodoType($event) {
    this.popover.dismiss({
      todoType: this.todoType
    });
  }
  changeAutoAddState($event) {
    this.popover.dismiss({
      isChecked: this.isChecked
    });
  }

  async deleteRegularTodo(id, index) {
    const alert = await this.alertCtrl.create({
      header: '提示',
      message: '确认<strong>删除</strong>? ',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { }
        }, {
          text: '确定',
          handler: () => {
            this.popover.dismiss({
              delete: true
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
