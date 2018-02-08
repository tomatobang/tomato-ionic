import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { JPushService } from '../providers/utils/jpush.service'; // 暂未启用
import { GlobalService } from '../providers/global.service';
import { UpdateService } from '../providers/utils/update.service';
import { NativeService } from '../providers/utils/native.service';
import { RebirthHttpProvider } from 'rebirth-http';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  templateUrl: 'app.html',
})
export class MyAppComponent {
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
    private events: Events
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      // 检查更新
      updateService.checkUpdate();
      native.initNativeService();
      // 开启后台运行
      // backgroundMode.enable();
      // 初始化 jPush
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
        this.rebirthProvider.headers({ Authorization: global.token });
        this.rebirthProvider.addResponseErrorInterceptor(err => {
          console.error('请求错误！', err);
        });
        this.rebirthProvider.addInterceptor({
          response: response => {
            response.subscribe(data => {
              const _body = JSON.parse(data._body);
              if (_body.status === 'fail') {
                console.error('请求参数错误:', _body.description);
              }
            });
          },
        });
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
}
