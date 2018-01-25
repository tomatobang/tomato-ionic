import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WaveSideBarComponent } from './wave-side-bar';
import { PinyinService } from '../../providers/utils/pinyin.service';

@NgModule({
  declarations: [WaveSideBarComponent],
  imports: [IonicPageModule.forChild(WaveSideBarComponent)],
  exports: [WaveSideBarComponent],
  providers: [PinyinService],
})
export class WaveSideBarComponentModule {}
