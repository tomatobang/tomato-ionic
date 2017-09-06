import { NgModule } from "@angular/core";
import { EchartsPage } from "./echarts";
import { IonicPageModule } from "ionic-angular";


@NgModule({
	declarations: [EchartsPage],
	imports: [IonicPageModule.forChild(EchartsPage)],
	providers: [],
})
export class EchartsPageModule {}
