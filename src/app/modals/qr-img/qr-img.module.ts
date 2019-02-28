import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QRImgModal } from './qr-img';
import { ClosePopupComponentModule } from '@components/close-popup/close-popup.module';

@NgModule({
  declarations: [QRImgModal],
  imports: [
    RouterModule.forChild([{ path: '', component: QRImgModal }]),
    ClosePopupComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QRImgModalModule { }
