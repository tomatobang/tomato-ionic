import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TomatoPage } from './tomato';
import { IndexIndexPage } from './index/index';
import { TodaylistComponent } from './todaylist/todaylist';
import { IonicModule } from '@ionic/angular';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';

import { AngularRoundProgressDirective } from '@directives/angular-round-progress.directive';
import { TimelineModule } from '@components/timeline/timeline.module';
import { VoiceRecorderComponent } from '@components/voice-recorder/';
import { AutosizeDirective } from '@directives/autosize.directive';
import { TaskPage } from './task/task';

import {
  OnlineTomatoService,
  OnlineTaskService,
} from '@services/data.service';
import { VoicePlayService } from '@services/utils/voiceplay.service';
import { File } from '@ionic-native/file/ngx';
import { Media } from '@ionic-native/media/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { SocketIoModule } from 'ngx-socket-io';
import { TomatoPageRoutingModule } from './tomato.router.module'

@NgModule({
  declarations: [
    TomatoPage,
    TaskPage,
    IndexIndexPage,
    TodaylistComponent,
    AngularRoundProgressDirective,
    VoiceRecorderComponent,
    AutosizeDirective
  ],
  imports: [
    IonicModule,
    TimelineModule,
    SharedModule,
    CoreModule,
    TomatoPageRoutingModule,
    SocketIoModule
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
  // to supress html syntax warning
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TomatoPageModule { }
