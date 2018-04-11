import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Chat } from './chat';
import { ChatService } from './providers/chat-service';
import { PipesModule } from '@pipes/pipes.module';
import { EmojiPickerComponentModule } from '@components/emoji-picker/emoji-picker.module';

@NgModule({
  declarations: [Chat],
  imports: [
    EmojiPickerComponentModule,
    IonicPageModule.forChild(Chat),
    PipesModule,
  ],
  exports: [Chat],
  providers: [ChatService],
})
export class ChatModule {}
