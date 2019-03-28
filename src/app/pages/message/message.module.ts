import { NgModule } from '@angular/core';
import { MessagePage } from './message';
import { EmojiPickerComponentModule } from '@components/emoji-picker/emoji-picker.module';

import { ChatPage } from './chat/chat';
import { ChatService } from './chat/providers/chat-service';
import { PipesModule } from '@pipes/pipes.module';
import { MessagePageRoutingModule } from './message.router.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [MessagePage, ChatPage],
  imports: [
    EmojiPickerComponentModule,
    PipesModule,
    MessagePageRoutingModule,
    SharedModule
  ],
  providers: [
    ChatService,
  ],
})
export class MessagePageModule { }
