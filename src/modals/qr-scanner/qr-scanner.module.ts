import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QRScannerModal } from './qr-scanner';
import { QRScanner } from '@ionic-native/qr-scanner';
import { ClosePopupComponentModule } from '@components/close-popup/close-popup.module';

@NgModule({
  declarations: [
    QRScannerModal,
  ],
  imports: [
    IonicPageModule.forChild(QRScannerModal),
    ClosePopupComponentModule,
  ],
  providers:[QRScanner]
})
export class QRScannerModalModule {}
