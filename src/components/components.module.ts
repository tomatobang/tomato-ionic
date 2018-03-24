import { NgModule } from '@angular/core';
import { VoiceRecorderComponent } from './voice-recorder/';
import { FriendTomatoesComponent } from './friend-tomatoes/friend-tomatoes';

@NgModule({
  declarations: [VoiceRecorderComponent,
    FriendTomatoesComponent],
  imports: [],
  exports: [VoiceRecorderComponent,
    FriendTomatoesComponent],
})
export class ComponentsModule {}
