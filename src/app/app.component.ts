import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { JPushService } from '../providers/utils/jpush.service';
import { GlobalService } from '../providers/global.service';
import { UpdateService } from '../providers/utils/update.service';
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
    updateService: UpdateService,
    public rebirthProvider: RebirthHttpProvider,
    private backgroundMode: BackgroundMode,
    global:GlobalService
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      // 检查更新
      debugger
      updateService.checkUpdate()
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
