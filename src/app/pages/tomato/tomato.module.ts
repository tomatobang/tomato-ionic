import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TomatoPage } from './tomato';
import { IndexIndexPage } from './index/index';
import { TodaylistComponent } from './todaylist/todaylist';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { AngularRoundProgressDirective } from '@directives/angular-round-progress.directive';
import { TimelineModule } from '@components/timeline/timeline.module';

import { TaskPage } from './task/task';

import { TomatoPageRoutingModule } from './tomato.router.module';
import { TomatoSettingPage } from './tomatosetting/tomatosetting';

@NgModule({
  declarations: [
    TomatoPage,
    TomatoSettingPage,
    TaskPage,
    IndexIndexPage,
    TodaylistComponent,
    AngularRoundProgressDirective,
  ],
  imports: [
    IonicModule,
    TimelineModule,
    SharedModule,
    TomatoPageRoutingModule,
  ],
  providers: [],
  entryComponents: [TaskPage],
  // to supress html syntax warning
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TomatoPageModule { }
