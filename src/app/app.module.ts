import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from "@angular/http";
import { BrowserModule } from '@angular/platform-browser';

import { MyApp } from './app.component';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:3000/chat', options: {} };

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GlobalService } from '../providers/global.service';
import { JPushService } from '../_util/jpush.service';
import { TomatoIOService } from '../_util/socket.io.service';

import { RebirthStorageModule } from 'rebirth-storage'; 
import { RebirthHttpModule  } from 'rebirth-http';

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
      tabsHideOnSubPages:true,
      tabsLayout:'icon-left'
    }),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalService,JPushService,TomatoIOService
  ]
})
export class AppModule {}
