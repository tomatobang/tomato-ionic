import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-regular-todo-form-popover',
  templateUrl: './regular-todo-form-popover.html',
  styleUrls: ['./regular-todo-form-popover.scss'],
})
export class RegularTodoFormPopoverComponent implements OnInit {

  title;
  todoType = '1';
  autoAdd = false;

  tips='';

  constructor(
    private popover: PopoverController
  ) {
  }

  ngOnInit() {
  }

  submit() {
    if(this.title){
      this.popover.dismiss({
        title: this.title,
        type: this.todoType,
        auto_add: this.autoAdd,
      })
    }else{
      this.tips = '标题不能为空!';
    }
   
  }

}
