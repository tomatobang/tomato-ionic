import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { JPushService } from '../_util/jpush.service';
import { GlobalService } from '../providers/global.service';
import { RebirthHttpProvider } from "rebirth-http";
import { BackgroundMode } from '@ionic-native/background-mode';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    //jPushService: JPushService,
    public rebirthProvider: RebirthHttpProvider,
    private backgroundMode: BackgroundMode,
    global:GlobalService
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      // 开启后台运行
      //backgroundMode.enable();
      // 初始化 jPush
      // if (global.userinfo){
      //   jPushService.init(global.userinfo.username);
      // }
    });

    // Check if the user has already seen the tutorial
    if (global.isFirstTimeOpen){
      global.isFirstTimeOpen = false;
      this.rootPage = "GuidePage";
    }else{
      if(global.userinfo){
        this.rebirthProvider.headers({ Authorization: global.token });
        this.rootPage = "TabsPage";
      }else{
        this.rootPage = "LoginPage";
      }
    }
  }

}
