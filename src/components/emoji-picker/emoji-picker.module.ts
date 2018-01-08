import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { EmojiPickerComponent } from "./emoji-picker";
import { EmojiProvider } from "./emoji.service";

@NgModule({
  declarations: [EmojiPickerComponent],
  imports: [IonicPageModule.forChild(EmojiPickerComponent)],
  exports: [EmojiPickerComponent],
  providers: [EmojiProvider]
})
export class EmojiPickerComponentModule {}
