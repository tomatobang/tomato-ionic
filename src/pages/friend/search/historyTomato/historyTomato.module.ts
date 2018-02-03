import { NgModule } from '@angular/core';
import { HistoryTomatoPage } from './historyTomato';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [HistoryTomatoPage],
  imports: [IonicPageModule.forChild(HistoryTomatoPage), SharedModule],
})
export class HistoryTomatoPageModule {}
