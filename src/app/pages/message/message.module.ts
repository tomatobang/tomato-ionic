import { NgModule } from '@angular/core';
import { MessagePage } from './message';
import { IonicModule } from '@ionic/angular';
import { EmojiPickerComponentModule } from '@components/emoji-picker/emoji-picker.module';

import { Chat } from './chat/chat';
import { ChatService } from './chat/providers/chat-service';
import { PipesModule } from '@pipes/pipes.module';
@NgModule({
  declarations: [MessagePage, Chat],
  imports: [
    IonicModule,
    EmojiPickerComponentModule,
    PipesModule,
  ],
  exports: [Chat],
  providers: [ChatService],
})
export class MessagePageModule { }
