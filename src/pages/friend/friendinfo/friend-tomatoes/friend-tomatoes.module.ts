import { NgModule } from '@angular/core';
import { FriendTomatoesPage } from './friend-tomatoes';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [FriendTomatoesPage],
  imports: [IonicPageModule.forChild(FriendTomatoesPage)],
})
export class FriendTomatoesPageModule {}
