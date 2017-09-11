import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { JPushService } from '../_util/jpush.service';

import { RebirthHttpProvider } from 'rebirth-http';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    jPushService: JPushService,
    rebirthProvider: RebirthHttpProvider,
    storage: Storage
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // 初始化 jPush
      jPushService.init();
    });
    rebirthProvider.headers({ Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBlbmd5aSIsInRpbWVzdGFtcCI6MTUwMzg4MTQyMzYzNywiaWF0IjoxNTAzODgxNDIzLCJleHAiOjE1MDM5Njc4MjN9.5Jh9pERttJThm3HzOzJeIGIPnBa1xSqaSaNJDuy5A1E" });
    // Check if the user has already seen the tutorial
    storage.get('hasSeenGuide')
      .then((hasSeenGuide) => {
        if (hasSeenGuide) {
          this.rootPage = "GuidePage";//"LoginPage";
        } else {
          this.rootPage = "GuidePage";
        }
      });
  }



}
