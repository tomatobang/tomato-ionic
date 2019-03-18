import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QRScannerModal } from './qr-scanner';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { ClosePopupComponentModule } from '@components/close-popup/close-popup.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EmitService } from '@services/emit.service';

@NgModule({
  declarations: [QRScannerModal],
  imports: [
    RouterModule.forChild([{ path: '', component: QRScannerModal }]),
    ClosePopupComponentModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [QRScanner, EmitService],
})
export class QRScannerModalModule { }
