import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

import { ListPageRoutingModule } from './list.router.module';
import { SharedModule } from '../../shared/shared.module';
import { ListPage } from './list.page';

@NgModule({
  imports: [SharedModule, ListPageRoutingModule, NgxEchartsModule],
  declarations: [ListPage],
})
export class ListPageModule { }
