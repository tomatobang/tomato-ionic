import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VoiceRecorderComponent } from '../../../components/voice-recorder/';

import {
  OnlineTomatoService,
  OnlineTaskService,
} from '../../../providers/data.service';

import { VoicePlayService } from '../../../providers/utils/voiceplay.service';
import { QiniuUploadService } from '../../../providers/qiniu.upload.service';

import { AutosizeDirective } from '../../../directives/autosize.directive';

import { TaskPage } from './task';
import { SharedModule } from '../../../shared/shared.module';
import { File } from '@ionic-native/file';
import { Media } from '@ionic-native/media';
import { FileTransfer } from '@ionic-native/file-transfer';

@NgModule({
  declarations: [
    TaskPage,
    VoiceRecorderComponent,
    AutosizeDirective,
  ],
  imports: [IonicPageModule.forChild(TaskPage), SharedModule],
  providers: [
    Media,
    File,
    FileTransfer,
    OnlineTaskService,
    OnlineTomatoService,
    VoicePlayService,
    QiniuUploadService,
  ],
  // 打开注释会报错
  // exports: [
  //     TaskPage
  // ]
})
export class TaskPageModule {}
