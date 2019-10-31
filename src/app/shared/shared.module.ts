import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PipesModule } from '@pipes/pipes.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import localeZh from '@angular/common/locales/zh';
registerLocaleData(localeZh);

import { DebounceClickDirective } from '@directives/debounce-click.directive';
import { TrackEventDirective } from '@directives/trackEvent.directive';
import { ShowBigImgDirective } from '@directives/show-big-image.directive';
import { VoiceRecoderDirective } from '@directives/voice-recorder.directive';
import { VoicePlayDirective } from '@directives/voice-play.directive';
import { AddTagDirective } from '@directives/add-tag.directive';
import { ShowVideoDirective } from '@directives/show-video.directive';
import { AutosizeDirective } from '@directives/autosize.directive';
import { EqualValidator } from '@directives/equal-validator.directive';

import { BillformComponent } from '../pages/bill/billform/billform.component';
import { ShowBigImgsModalModule } from '@modals/show-big-imgs/show-big-imgs.module';
import { ShowVideoModalModule } from '@modals/show-video/show-video.module';

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
    ReactiveFormsModule,
    PipesModule,
    CalendarModule,
    ShowBigImgsModalModule,
    ShowVideoModalModule,
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
  declarations: [
    DebounceClickDirective, TrackEventDirective, ShowBigImgDirective,
    VoiceRecoderDirective, VoicePlayDirective, AddTagDirective, AutosizeDirective, EqualValidator,
    ShowVideoDirective, VoiceRecorderComponent, BillformComponent
  ],
  entryComponents: [VoiceRecorderComponent, BillformComponent],
  providers: [], // better be empty!
  exports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    ShowVideoDirective,
    AddTagDirective,
    AutosizeDirective,
    EqualValidator,
  ],
})
export class SharedModule { }
