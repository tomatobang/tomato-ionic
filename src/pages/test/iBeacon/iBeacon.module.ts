import { NgModule } from "@angular/core";
import { IBeaconPage } from "./iBeacon";
import { IonicPageModule } from "ionic-angular";
import { IBeaconService } from "../../../_util/ibeacon.service";
import { IBeacon } from "@ionic-native/ibeacon";


@NgModule({
	declarations: [IBeaconPage],
	imports: [IonicPageModule.forChild(IBeaconPage)],
	providers: [IBeaconService,IBeacon]
})
export class IBeaconPageModule {}
