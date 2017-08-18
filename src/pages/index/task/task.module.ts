import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";

import {
	OnlineTomatoService,
	OnlineTaskService
} from "../../../providers/data.service";

import { TaskPage } from "./task";
import { TaskPipe } from "../../../pipes/taskPipe";

@NgModule({
	declarations: [
        TaskPage,
        TaskPipe
	],
	imports: [IonicPageModule.forChild(TaskPage)],
    providers: [OnlineTaskService, OnlineTomatoService],
    // exports: [
    //     TaskPage
    // ]
})
export class TaskPageModule {}
