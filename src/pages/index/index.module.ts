import { NgModule } from "@angular/core";
import { IndexPage } from "./index";
import { IonicPageModule } from "ionic-angular";

import {
	OnlineTomatoService,
	OnlineTaskService
} from "../../providers/data.service";

import { StringTruncate } from "../../pipes/stringTruncate";
import { DateTransform } from "../../pipes/dateTransform";
import { AngularRoundProgressComponent } from "../../directives/angular-round-progress-directive";
import { TimelineModule } from "../../components/timeline/timeline.module";

import { VoicePlayService } from "../../providers/utils/voiceplay.service";
import { File } from '@ionic-native/file';
import { Media } from "@ionic-native/media";
import { LocalNotifications } from '@ionic-native/local-notifications';

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
	imports: [IonicPageModule.forChild(IndexPage),TimelineModule],
    providers: [OnlineTaskService, OnlineTomatoService,VoicePlayService,File,Media,FileTransfer,LocalNotifications],
    entryComponents:[]
})

export class IndexPageModule {}