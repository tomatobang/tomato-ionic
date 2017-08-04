import { NgModule } from "@angular/core";
import { TestPage } from "./test";
import { IonicPageModule } from "ionic-angular";
import { IBeaconService } from "../../_util/ibeacon.service";
import { SocketIOService } from "../../_util/socket.io.service";
import { IBeacon } from "@ionic-native/ibeacon";


@NgModule({
	declarations: [TestPage],
	imports: [IonicPageModule.forChild(TestPage)],
	providers: [IBeaconService,SocketIOService,IBeacon]
})
export class TestPageModule {}
