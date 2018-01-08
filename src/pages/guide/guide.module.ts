import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GuidePage } from "./guide";

@NgModule({
  declarations: [GuidePage],
  imports: [IonicPageModule.forChild(GuidePage)],
  exports: [GuidePage]
})
export class GuidePageModule {}
