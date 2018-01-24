import { NgModule } from '@angular/core';
import { MessagePage } from './message';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [MessagePage],
  imports: [IonicPageModule.forChild(MessagePage)]
})
export class MessagePageModule {}
