import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
// import * as hidpiCanvas from 'hidpi-canvas/dist/hidpi-canvas.min.js'
import { MyAppComponent } from './app.component';
import { BackgroundMode } from '@ionic-native/background-mode';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { baseUrl } from '../config';
// declare let config: SocketIoConfig;
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GlobalService } from '../providers/global.service';
import { JPushService } from '../providers/utils/jpush.service';
import { UpdateService } from '../providers/utils/update.service';
import { TomatoIOService } from '../providers/utils/socket.io.service';
import { Helper } from '../providers/utils/helper';
import { NativeService } from '../providers/utils/native.service';

import { RebirthStorageModule } from 'rebirth-storage';
import { RebirthHttpModule } from 'rebirth-http';
import { IonicStorageModule } from '@ionic/storage';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Insomnia } from '@ionic-native/insomnia';
import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [MyAppComponent],
  imports: [
    RebirthStorageModule,
    RebirthHttpModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyAppComponent, {
      tabsHideOnSubPages: true, // 子页隐藏 TAB
      tabsLayout: 'icon-left',
      iconMode: 'ios',
      swipeBackEnabled: false, // 禁用 IOS 手势滑动返回
    }),
    SocketIoModule.forRoot({ url: `${baseUrl}tomatobang`, options: {} }),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyAppComponent],
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
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    // { provide: ErrorHandler, useClass: RavenErrorHandler }
  ],
})
export class AppModule {}
