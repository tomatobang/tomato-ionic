import { NgModule } from "@angular/core";
import { IonicPageModule, IonicModule } from "ionic-angular";
import { SettingPage } from "./setting";
import { Insomnia } from "@ionic-native/insomnia";

@NgModule({
  declarations: [SettingPage],
  imports: [IonicPageModule.forChild(SettingPage)],
  providers: [Insomnia]
})
export class SettingPageModule {}
