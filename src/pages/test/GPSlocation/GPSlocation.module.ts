import { NgModule } from "@angular/core";
import { GPSlocationPage } from "./GPSlocation";
import { IonicPageModule } from "ionic-angular";
import { SocketIOService } from "../../../_util/socket.io.service";

@NgModule({
	declarations: [GPSlocationPage],
	imports: [IonicPageModule.forChild(GPSlocationPage)],
	providers: [SocketIOService]
})
export class GPSlocationPageModule {}
