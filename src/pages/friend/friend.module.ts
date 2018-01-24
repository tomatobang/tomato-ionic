import { NgModule } from '@angular/core';
import { FriendPage } from './friend';
import { IonicPageModule } from 'ionic-angular';
import { QRScannerComponentModule } from '../../components/qr-scanner/qr-scanner.module';
import { QRScanner } from '@ionic-native/qr-scanner';
@NgModule({
  declarations: [FriendPage],
  imports: [IonicPageModule.forChild(FriendPage), QRScannerComponentModule],
  providers: [QRScanner],
})
export class FriendPageModule {}
