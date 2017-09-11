import { NgModule } from "@angular/core";
import { IndexPage } from "./index";
import { IonicPageModule } from "ionic-angular";

import {
	OnlineTomatoService,
	OnlineTaskService
} from "../../providers/data.service";

import { StringTruncate } from "../../pipes/stringTruncate";
import { DateTransform } from "../../pipes/dateTransform";
import { AngularRoundProgressComponent } from "../../_directives/angular-round-progress-directive";

import { VoicePlayService } from "../../_util/voiceplay.service";
import { File } from '@ionic-native/file';
import { Media } from "@ionic-native/media";
import {
	FileTransfer
} from "@ionic-native/file-transfer";

@NgModule({
	declarations: [
		IndexPage,
		StringTruncate,
		DateTransform,
		AngularRoundProgressComponent
	],
	imports: [IonicPageModule.forChild(IndexPage)],
    providers: [OnlineTaskService, OnlineTomatoService,VoicePlayService,File,Media,FileTransfer],
    entryComponents:[]
})

export class IndexPageModule {}