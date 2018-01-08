/*
 * @Author: kobepeng 
 * @Date: 2017-11-20 19:19:52 
 * @Last Modified by: kobepeng
 * @Last Modified time: 2017-12-02 10:52:03
 */
import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
// import * as hidpiCanvas from 'hidpi-canvas/dist/hidpi-canvas.min.js'
import { MyApp } from "./app.component";
import { BackgroundMode } from "@ionic-native/background-mode";

import { SocketIoModule, SocketIoConfig } from "ng-socket-io";
import { baseUrl } from "../config";
// declare let config: SocketIoConfig;
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { GlobalService } from "../providers/global.service";
import { JPushService } from "../providers/utils/jpush.service";
import { UpdateService } from "../providers/utils/update.service";
import { TomatoIOService } from "../providers/utils/socket.io.service";
import { Helper } from "../providers/utils/helper";
import { NativeService } from "../providers/utils/native.service";

import { RebirthStorageModule } from "rebirth-storage";
import { RebirthHttpModule } from "rebirth-http";
import { IonicStorageModule } from "@ionic/storage";
import { FileTransfer } from "@ionic-native/file-transfer";
import { FileOpener } from "@ionic-native/file-opener";
import { File } from "@ionic-native/file";
import { Insomnia } from "@ionic-native/insomnia";
import { Network } from "@ionic-native/network";

import * as Raven from "raven-js";
Raven.config(
  "https://8583117beafb40a8be2906252ee80fcc@sentry.io/240912"
).install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err);
  }
}

@NgModule({
  declarations: [MyApp],
  imports: [
    RebirthStorageModule,
    RebirthHttpModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true, // 子页隐藏 TAB
      tabsLayout: "icon-left",
      iconMode: "ios",
      swipeBackEnabled: false // 禁用 IOS 手势滑动返回
    }),
    SocketIoModule.forRoot({ url: `${baseUrl}tomatobang`, options: {} }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    BackgroundMode,
    SplashScreen,
    GlobalService,
    JPushService,
    NativeService,
    TomatoIOService,
    Helper,
    UpdateService,
    File,
    FileTransfer,
    FileOpener,
    Insomnia,
    Network,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
    // { provide: ErrorHandler, useClass: RavenErrorHandler }
  ]
})
export class AppModule {}
