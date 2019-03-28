import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { FootprintPage } from './footprint.page';

const routes: Routes = [
  {
    path: '',
    component: FootprintPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FootprintPage]
})
export class FootprintPageModule { }
