import { NgModule } from '@angular/core';
import { FriendPage } from './friend';
import { IonicPageModule } from 'ionic-angular';
import { QRScannerComponentModule } from '@components/qr-scanner/qr-scanner.module';
import { PullToShowDirective } from '@directives/pull-to-show.directive';
import { QRScanner } from '@ionic-native/qr-scanner';
@NgModule({
  declarations: [FriendPage, PullToShowDirective],
  imports: [IonicPageModule.forChild(FriendPage), QRScannerComponentModule],
  providers: [QRScanner],
})
export class FriendPageModule {}
