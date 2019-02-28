import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ListPage } from './list.page';

const routes: Routes = [
  {
    path: '',
    loadChildren: './ngrxtodo/ngrxtodo.module#NgrxTodoPageModule',
  },
  {
    path: 'todo',
    loadChildren: './ngrxtodo/ngrxtodo.module#NgrxTodoPageModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPageRoutingModule { }
