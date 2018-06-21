import { Component, OnInit } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// TODO:启用极光推送
// import { JPushService } from '@providers/utils/jpush.service';
import { GlobalService } from '@providers/global.service';
import { InfoService } from '@providers/info.service';
import { UpdateService } from '@providers/utils/update.service';
import { NativeService } from '@providers/utils/native.service';
import { ChatIOService } from '@providers/utils/socket.io.service';
import { RebirthHttpProvider } from 'rebirth-http';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  templateUrl: 'app.html',
})
export class MyAppComponent implements OnInit {
  rootPage: any;
  hideNav = false;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    // jPushService: JPushService,
    updateService: UpdateService,
    public rebirthProvider: RebirthHttpProvider,
    private backgroundMode: BackgroundMode,
    global: GlobalService,
    native: NativeService,
    info: InfoService,
    public chatIO: ChatIOService,
    private events: Events
  ) {
    platform.ready().then(() => {
      statusBar.overlaysWebView(false);
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString('#f8f8f8');

      // 手动隐藏 splash screen
      splashScreen.hide();

      // 检查更新
      updateService.checkUpdate();
      native.initNativeService();

      // 开启后台运行
      // backgroundMode.enable();

      // 极光推送初始化
      // if (global.userinfo){
      //   jPushService.init(global.userinfo.username);
      // }
    });

    // Check if the user has already seen the tutorial
    if (global.isFirstTimeOpen) {
      global.isFirstTimeOpen = false;
      this.rootPage = 'GuidePage';
    } else {
      if (global.userinfo) {
        this.rebirthProvider.headers({ Authorization: global.token }, true);
        this.rebirthProvider.addResponseErrorInterceptor(err => {
          console.error('请求错误！', err);
        });
        // 消息服务初始化
        chatIO.login(global.userinfo.userid);
        info.init();
        this.rootPage = 'TabsPage';
      } else {
        this.rootPage = 'LoginPage';
      }
    }

    events.subscribe('qrScanner:show', () => {
      this.hideNav = true;
    });
    events.subscribe('qrScanner:hide', () => {
      this.hideNav = false;
    });
  }

  ngOnInit() {}
}
