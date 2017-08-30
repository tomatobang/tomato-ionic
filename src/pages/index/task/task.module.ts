import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { VoiceRecorderComponent } from "../../../components/voice-recorder/";

import {
	OnlineTomatoService,
	OnlineTaskService
} from "../../../providers/data.service";

import { TaskPage } from "./task";
import { TaskPipe } from "../../../pipes/taskPipe";

@NgModule({
	declarations: [
        TaskPage,
        TaskPipe,
        VoiceRecorderComponent
	],
	imports: [IonicPageModule.forChild(TaskPage)],
    providers: [OnlineTaskService, OnlineTomatoService],
    // 打开注释会报错
    // exports: [
    //     TaskPage
    // ]
})
export class TaskPageModule {}
