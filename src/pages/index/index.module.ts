import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IndexPage } from './index';
import { IndexIndexPage } from './index/index';
import { TodaylistComponent } from './todaylist/todaylist';
import { IonicPageModule } from 'ionic-angular';

import {
  OnlineTomatoService,
  OnlineTaskService,
} from '@providers/data.service';

import { SharedModule } from '../../shared/shared.module';
import { AngularRoundProgressDirective } from '@directives/angular-round-progress.directive';
import { AutosizeDirective } from '@directives/autosize.directive';
import { TimelineModule } from '@components/timeline/timeline.module';

import { VoicePlayService } from '@providers/utils/voiceplay.service';
import { File } from '@ionic-native/file';
import { Media } from '@ionic-native/media';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FileTransfer } from '@ionic-native/file-transfer';

import { IonMarqueeModule } from 'ionic-marquee';

@NgModule({
  declarations: [
    IndexPage,
    IndexIndexPage,
    TodaylistComponent,
    AngularRoundProgressDirective,
  ],
  imports: [
    IonMarqueeModule,
    IonicPageModule.forChild(IndexPage),
    TimelineModule,
    SharedModule,
  ],
  providers: [
    OnlineTaskService,
    OnlineTomatoService,
    VoicePlayService,
    File,
    Media,
    FileTransfer,
    LocalNotifications,
  ],
  entryComponents: [],
  // to supress html syntax warning
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IndexPageModule {}
