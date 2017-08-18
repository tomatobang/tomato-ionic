import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { JPushService } from '../_util/jpush.service';

import { RebirthHttpProvider } from 'rebirth-http';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'TabsPage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, jPushService:JPushService,public rebirthProvider: RebirthHttpProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // 初始化 jPush
      jPushService.init();
    });
    rebirthProvider.headers({ Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBlbmd5aSIsInRpbWVzdGFtcCI6MTUwMzA1NjMzNjE4OSwiaWF0IjoxNTAzMDU2MzM2LCJleHAiOjE1MDMxNDI3MzZ9.qUoji9vWzeziBX9McMKWi9Wk2wly-9RTO9kpLJXitNw"});
  }
}
