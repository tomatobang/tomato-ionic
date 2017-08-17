import { NgModule } from "@angular/core";
import { IndexPage } from "./index";
import { IonicPageModule } from "ionic-angular";

import {
	OnlineTomatoService,
	OnlineTaskService
} from "../../providers/data.service";

import { TaskPipe } from "../../pipes/taskPipe";
import { StringTruncate } from "../../pipes/stringTruncate";
import { DateTransform } from "../../pipes/dateTransform";
import { AngularRoundProgressComponent } from "../../_directives/angular-round-progress-directive";

@NgModule({
	declarations: [
		IndexPage,
		TaskPipe,
		StringTruncate,
		DateTransform,
        AngularRoundProgressComponent
	],
	imports: [IonicPageModule.forChild(IndexPage)],
    providers: [OnlineTaskService, OnlineTomatoService],
    entryComponents:[]
})
export class IndexPageModule {}
