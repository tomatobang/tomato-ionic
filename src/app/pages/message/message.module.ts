import { NgModule } from '@angular/core';
import { MessagePage } from './message';
import { EmojiPickerComponentModule } from '@components/emoji-picker/emoji-picker.module';

import { ChatPage } from './chat/chat';
import { ChatService } from './chat/providers/chat-service';
import { PipesModule } from '@pipes/pipes.module';
import { MessagePageRoutingModule } from './message.router.module';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import {
  ChatIOService,
} from '@services/utils/socket.io.service';
declare var window;

@NgModule({
  declarations: [MessagePage, ChatPage],
  imports: [
    EmojiPickerComponentModule,
    PipesModule,
    MessagePageRoutingModule,
    CoreModule,
    SharedModule
  ],
  providers: [
    ChatService, 
    { provide: ChatIOService, useValue: window.appChatIOService }
  ],
})
export class MessagePageModule { }
