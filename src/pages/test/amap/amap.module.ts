import { NgModule } from "@angular/core";
import { AMapPage } from "./amap";
import { IonicPageModule } from "ionic-angular";


@NgModule({
	declarations: [AMapPage],
	imports: [IonicPageModule.forChild(AMapPage)],
	providers: []
})
export class AMapPageModule {}
