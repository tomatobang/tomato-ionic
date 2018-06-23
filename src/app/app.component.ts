import { Component, OnInit } from '@angular/core';
import { App, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RebirthHttpProvider } from 'rebirth-http';
import { BackgroundMode } from '@ionic-native/background-mode';

// TODO:启用极光推送
// import { JPushService } from '@providers/utils/jpush.service';
import { GlobalService } from '@providers/global.service';
import { InfoService } from '@providers/info.service';
import { ChatIOService } from '@providers/utils/socket.io.service';
import { UpdateService } from '@providers/utils/update.service';
import { NativeService } from '@providers/utils/native.service';
import { OnlineUserService } from '@providers/data.service';

@Component({
  templateUrl: 'app.html',
})
export class MyAppComponent implements OnInit {
  rootPage: any;
  hideNav = false;

  constructor(
    public app: App,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    // jPushService: JPushService,
    updateService: UpdateService,
    public rebirthProvider: RebirthHttpProvider,
    private backgroundMode: BackgroundMode,
    public global: GlobalService,
    public native: NativeService,
    public info: InfoService,
    public chatIO: ChatIOService,
    private events: Events,
    public userService: OnlineUserService
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

    events.subscribe('qrScanner:show', () => {
      this.hideNav = true;
    });
    events.subscribe('qrScanner:hide', () => {
      this.hideNav = false;
    });
  }

  ngOnInit() {
    if (this.global.isFirstTimeOpen) {
      this.global.isFirstTimeOpen = false;
      this.rootPage = 'GuidePage';
    } else {
      if (this.global.userinfo) {
        this.rebirthProvider.headers(
          { Authorization: this.global.token },
          true
        );
        this.rebirthProvider.addResponseErrorInterceptor(err => {
          console.error('请求错误！', err);
        });
        this.userService.auth().subscribe(data => {
          if (data && data.status) {
            this.chatIO.login(this.global.userinfo.userid);
            this.info.init();
            this.rootPage = 'TabsPage';
          } else {
            // token 过期
            this.app.getRootNav().setRoot(
              'LoginPage',
              {
                username: this.global.userinfo.username,
                password: this.global.userinfo.password,
              },
              {},
              () => {
                this.global.userinfo = '';
                this.global.token = '';
              }
            );
          }
        });
      } else {
        this.rootPage = 'LoginPage';
      }
    }
  }
}
