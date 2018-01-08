import { NgModule } from "@angular/core";
import { RegisterPage } from "./register";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [RegisterPage],
  imports: [IonicPageModule.forChild(RegisterPage)]
})
export class RegisterPageModule {}
