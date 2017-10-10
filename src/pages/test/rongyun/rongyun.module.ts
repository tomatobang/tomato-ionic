import { NgModule } from "@angular/core";
import { RongyunPage } from "./rongyun";
import { IonicPageModule } from "ionic-angular";
import { RongYunService } from "../../../_util/rongyun.service";
import { RongyunUtil } from "../../../_util/rongyun.util";


@NgModule({
	declarations: [RongyunPage],
	imports: [IonicPageModule.forChild(RongyunPage)],
	providers: [RongYunService,RongyunUtil],
})
export class RongyunPageModule {}
