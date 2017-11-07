import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from "@angular/http";
import { BrowserModule } from '@angular/platform-browser';
// import * as hidpiCanvas from 'hidpi-canvas/dist/hidpi-canvas.min.js'
import { MyApp } from './app.component';
import { BackgroundMode } from '@ionic-native/background-mode';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { baseUrl } from '../config'
const config: SocketIoConfig = { url: baseUrl + 'tomatobang', options: {} };

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GlobalService } from '../providers/global.service';
import { JPushService } from '../_util/jpush.service';
import { TomatoIOService } from '../_util/socket.io.service';
import { Helper } from '../_util/helper';

import { RebirthStorageModule } from 'rebirth-storage';
import { RebirthHttpModule } from 'rebirth-http';
import { IonicStorageModule } from '@ionic/storage';


import * as Raven from 'raven-js';
Raven
  .config('https://8583117beafb40a8be2906252ee80fcc@sentry.io/240912')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err);
  }
}


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    RebirthStorageModule,
    RebirthHttpModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      // 子页隐藏 TAB
      tabsHideOnSubPages: true,
      tabsLayout: 'icon-left',
      iconMode: "ios",
      // 禁用 IOS 手势滑动返回
      swipeBackEnabled: false
    }),
    SocketIoModule.forRoot(config),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar, BackgroundMode,
    SplashScreen,
    GlobalService, JPushService, TomatoIOService, Helper,
    // {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: ErrorHandler, useClass: RavenErrorHandler }
  ]
})
export class AppModule { }
