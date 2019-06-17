import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { AppState } from './../redux/ngrxtodo.reducer';
import * as TodoActions from './../redux/todo/todo.actions';

@Component({
    selector: 'app-new-todo',
    templateUrl: './new-todo.component.html',
    styleUrls: ['./new-todo.component.scss']
})
export class NewTodoComponent implements OnInit {
    title;
    textField: FormControl;
    todoType = {
        value: '1'
    };

    constructor(
        private store: Store<AppState>
    ) {
        this.textField = new FormControl('', [Validators.required]);
    }

    ngOnInit() {
    }

    saveTodo() {
        if (this.textField.valid) {
            const title: string = this.textField.value;
            const action = new TodoActions.AddTodoAction(title.trim(), parseInt(this.todoType.value, 10));
            this.store.dispatch(action);
            this.textField.setValue('', { emitEvent: false });
            this.title = '';
        }
    }

}
