import { NgModule } from '@angular/core';
import { StatisticsPage } from './statistics';
import { IonicPageModule } from 'ionic-angular';
import { OnlineTomatoService } from '../../../../providers/data.service';

@NgModule({
  declarations: [StatisticsPage],
  imports: [IonicPageModule.forChild(StatisticsPage)],
  providers: [OnlineTomatoService]
})
export class StatisticsPageModule {}
