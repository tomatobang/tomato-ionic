import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EmojiPickerComponent } from './emoji-picker';
import { EmojiProvider } from './emoji.service';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [EmojiPickerComponent],
  imports: [IonicModule, CommonModule],
  exports: [EmojiPickerComponent],
  providers: [EmojiProvider]
})
export class EmojiPickerComponentModule { }
