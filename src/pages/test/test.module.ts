/**
 * Created by hsuanlee on 2017/4/4.
 */
import { NgModule } from "@angular/core";
import { TestPage } from "./test";
import { IonicPageModule } from "ionic-angular";
import { IBeaconService } from "../../_util/IBeaconService";

@NgModule({
	declarations: [TestPage],
	imports: [IonicPageModule.forChild(TestPage)],
	providers: [IBeaconService]
})
export class TestPageModule {}
