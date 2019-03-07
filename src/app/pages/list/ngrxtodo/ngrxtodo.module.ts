import { ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ngrxtodoReducer } from './redux/ngrxtodo.reducer';
import { EffectsModule } from '@ngrx/effects';

import { NgRxTodoComponent } from './ngrxtodo.page';
import { TodoComponent } from './todo/todo.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { FooterComponent } from './footer/footer.component';
import { NewTodoComponent } from './new-todo/new-todo.component';
import { TodoEffects } from './redux/todo/todo.effect';
import { RegularTodoComponent } from './regular-todo/regular-todo.component';
import { SharedModule } from './../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: NgRxTodoComponent,
    children: [
      {
        path: '',
        component: TodoListComponent,
      },
      {
        path: ':filter',
        component: TodoListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    NgRxTodoComponent,
    TodoComponent,
    TodoListComponent,
    FooterComponent,
    NewTodoComponent,
    RegularTodoComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('ngrxtodo', ngrxtodoReducer),
    EffectsModule.forFeature([TodoEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 15, //  Retains last 15 states
    }),
  ],
  entryComponents: [RegularTodoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgrxTodoPageModule { }
