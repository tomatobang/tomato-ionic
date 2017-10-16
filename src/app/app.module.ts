import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from "@angular/http";
import { BrowserModule } from '@angular/platform-browser';
// import * as hidpiCanvas from 'hidpi-canvas/dist/hidpi-canvas.min.js'
import { MyApp } from './app.component';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { baseUrl } from '../config'
const config: SocketIoConfig = { url: baseUrl+'tomatobang', options: {} };

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GlobalService } from '../providers/global.service';
import { JPushService } from '../_util/jpush.service';
import { TomatoIOService } from '../_util/socket.io.service';

import { RebirthStorageModule } from 'rebirth-storage'; 
import { RebirthHttpModule  } from 'rebirth-http';
import { IonicStorageModule } from '@ionic/storage';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    RebirthStorageModule,
    RebirthHttpModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      // 子页隐藏 TAB
      tabsHideOnSubPages:true,
      tabsLayout:'icon-left',
      iconMode:"ios",
      // 禁用 IOS 手势滑动返回
      swipeBackEnabled:false
    }),
    SocketIoModule.forRoot(config),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GlobalService,JPushService,TomatoIOService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
