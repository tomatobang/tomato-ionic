import { NgModule } from '@angular/core';
import { FriendPage } from './friend';
import { IonicPageModule } from 'ionic-angular';
import { QRScanner } from '@ionic-native/qr-scanner';

@NgModule({
  declarations: [FriendPage],
  imports: [IonicPageModule.forChild(FriendPage)],
  providers: [QRScanner],
})
export class FriendPageModule {}
