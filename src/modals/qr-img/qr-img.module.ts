import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QRImgModal } from './qr-img';
import { ClosePopupComponentModule } from '@components/close-popup/close-popup.module';

@NgModule({
  declarations: [QRImgModal],
  imports: [IonicPageModule.forChild(QRImgModal), ClosePopupComponentModule],
})
export class QRScannerModalModule {}
