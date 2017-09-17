import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { JPushService } from '../_util/jpush.service';

import { GlobalService } from '../providers/global.service';
import { RebirthHttpProvider } from 'rebirth-http';

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
    global:GlobalService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // 初始化 jPush
      // if (global.userinfo){
      //   jPushService.init(global.userinfo.username);
      // }
    });
    rebirthProvider.headers({ Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBlbmd5aSIsInRpbWVzdGFtcCI6MTUwMzg4MTQyMzYzNywiaWF0IjoxNTAzODgxNDIzLCJleHAiOjE1MDM5Njc4MjN9.5Jh9pERttJThm3HzOzJeIGIPnBa1xSqaSaNJDuy5A1E" });
    // Check if the user has already seen the tutorial
    if (global.isFirstTimeOpen){
      global.isFirstTimeOpen = false;
      this.rootPage = "GuidePage";
    }else{
      this.rootPage = "LoginPage";
    }
  }



}
