import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { VoiceRecorderComponent } from "../../../components/voice-recorder/";

import {
  OnlineTomatoService,
  OnlineTaskService
} from "../../../providers/data.service";

import { VoicePlayService } from "../../../providers/utils/voiceplay.service";

import { TaskPage } from "./task";
import { TaskPipe } from "../../../pipes/taskPipe";
import { File } from "@ionic-native/file";
import { Media } from "@ionic-native/media";
import { FileTransfer } from "@ionic-native/file-transfer";

@NgModule({
  declarations: [TaskPage, TaskPipe, VoiceRecorderComponent],
  imports: [IonicPageModule.forChild(TaskPage)],
  providers: [
    Media,
    File,
    FileTransfer,
    OnlineTaskService,
    OnlineTomatoService,
    VoicePlayService
  ]
  // 打开注释会报错
  // exports: [
  //     TaskPage
  // ]
})
export class TaskPageModule {}
