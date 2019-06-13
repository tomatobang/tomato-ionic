import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShowVideoModal } from './show-video';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { ClosePopupComponentModule } from '@components/close-popup/close-popup.module';

@NgModule({
  declarations: [ShowVideoModal],
  imports: [
    ClosePopupComponentModule,
    CommonModule,
    IonicModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  entryComponents: [ShowVideoModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShowVideoModalModule { }
