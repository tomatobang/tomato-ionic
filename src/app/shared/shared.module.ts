import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PipesModule } from '@pipes/pipes.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { DebounceClickDirective } from '@directives/debounce-click.directive';
import { TrackEventDirective } from '@directives/trackEvent.directive';
import { ShowBigImgDirective } from '@directives/show-big-image.directive';
import { VoiceRecoderDirective } from '@directives/voice-recorder.directive';
import { VoicePlayDirective } from '@directives/voice-play.directive';
import { AddTagDirective } from '@directives/add-tag.directive';


import { ShowBigImgsModalModule } from '@modals/show-big-imgs/show-big-imgs.module';

import { CalendarModule } from '../components/ion2-calendar';
import { SocketIoModule } from 'ngx-socket-io';

import { VoiceRecorderComponent } from '@components/voice-recorder/';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PipesModule,
    CalendarModule,
    ShowBigImgsModalModule,
    HttpClientModule,
    SocketIoModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [DebounceClickDirective, TrackEventDirective,
    ShowBigImgDirective, VoiceRecoderDirective, VoiceRecorderComponent, VoicePlayDirective, AddTagDirective],
  entryComponents: [VoiceRecorderComponent],
  providers: [], // better be empty!
  exports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CalendarModule,
    SocketIoModule,
    HttpClientModule,
    PipesModule,
    TranslateModule,
    DebounceClickDirective,
    TrackEventDirective,
    VoicePlayDirective,
    VoiceRecoderDirective,
    ShowBigImgDirective,
    AddTagDirective,
  ],
})
export class SharedModule { }
