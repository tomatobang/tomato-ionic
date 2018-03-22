import { NgModule } from '@angular/core';
import { TabsPage } from './tabs';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [TabsPage],
  imports: [IonicPageModule.forChild(TabsPage), SharedModule],
})
export class TabsPageModule {}
