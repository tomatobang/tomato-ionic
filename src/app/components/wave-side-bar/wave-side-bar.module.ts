import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WaveSideBarComponent } from './wave-side-bar';
import { PinyinService } from '@services/utils/pinyin.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [WaveSideBarComponent],
  imports: [IonicModule, CommonModule],
  exports: [WaveSideBarComponent],
  providers: [PinyinService],
})
export class WaveSideBarComponentModule {}
