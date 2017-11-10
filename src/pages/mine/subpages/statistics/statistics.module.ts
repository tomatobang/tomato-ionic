import { NgModule } from "@angular/core";
import { StatisticsPage } from "./statistics";
import { IonicPageModule } from "ionic-angular";


@NgModule({
	declarations: [StatisticsPage],
	imports: [IonicPageModule.forChild(StatisticsPage)],
	providers: [],
})
export class StatisticsPageModule {}
