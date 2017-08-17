import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";

import {
	OnlineTomatoService,
	OnlineTaskService
} from "../../../providers/data.service";

import { TaskPage } from "./task";

@NgModule({
	declarations: [
        TaskPage
	],
	imports: [IonicPageModule.forChild(TaskPage)],
    providers: [OnlineTaskService, OnlineTomatoService],
    // exports: [
    //     TaskPage
    // ]
})
export class TaskPageModule {}
