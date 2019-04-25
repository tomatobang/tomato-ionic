import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShowBigImgsModal } from './show-big-imgs';
import { ClosePopupComponentModule } from '@components/close-popup/close-popup.module';

@NgModule({
  declarations: [ShowBigImgsModal],
  imports: [
    ClosePopupComponentModule,
    CommonModule,
    IonicModule
  ],
  entryComponents: [ShowBigImgsModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShowBigImgsModalModule { }
