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
    rebirthProvider.headers({ Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBlbmd5aSIsInRpbWVzdGFtcCI6MTUwMzQ4ODMzOTI3NywiaWF0IjoxNTAzNDg4MzM5LCJleHAiOjE1MDM1NzQ3Mzl9.iXPO8VV89VVFEWsa4_eBy-UJe7WwzYeCV8JnEq5YKjA"});
  }
}
