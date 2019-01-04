import { Component, OnInit } from '@angular/core';
import { App, Platform, ToastController, Events, IonicApp } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RebirthHttpProvider } from 'rebirth-http';
import { BackgroundMode } from '@ionic-native/background-mode';

import { JPush } from '@jiguang-ionic/jpush';
import { GlobalService } from '@providers/global.service';
import { InfoService } from '@providers/info.service';
import { ChatIOService } from '@providers/utils/socket.io.service';
import { UpdateService } from '@providers/utils/update.service';
import { NativeService } from '@providers/utils/native.service';
import { OnlineUserService } from '@providers/data.service';
import { AppCenterCrashes } from '@ionic-native/app-center-crashes';
import { AppCenterAnalytics } from '@ionic-native/app-center-analytics';

declare var window;
@Component({
  templateUrl: 'app.html',
})
export class MyAppComponent implements OnInit {
  rootPage: any;
  hideNav = false;
  backButtonPressed = false;

  constructor(
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    jPush: JPush,
    updateService: UpdateService,
    backgroundMode: BackgroundMode,
    events: Events,
    public app: App,
    public ionicApp: IonicApp,
    public platform: Platform,
    public rebirthProvider: RebirthHttpProvider,
    public global: GlobalService,
    public native: NativeService,
    public info: InfoService,
    public chatIO: ChatIOService,
    public userService: OnlineUserService,
    public toastCtrl: ToastController,
    private AppCenterCrashes: AppCenterCrashes,
    private appCenterAnalytics: AppCenterAnalytics
  ) {
    platform.ready().then(() => {
      if (window.cordova) {
        statusBar.overlaysWebView(false);
        statusBar.styleDefault();
        statusBar.backgroundColorByHexString('#f8f8f8');
        splashScreen.hide();
        updateService.checkUpdate();
        native.initNativeService();
        this.registerBackButtonAction();
        if (global.userinfo) {
          jPush.init();
          jPush.setAlias({
            sequence: new Date().getTime(),
            alias: global.userinfo.username,
          });
        }
        backgroundMode.disable();
        this.AppCenterCrashes.setEnabled(true).then(() => {
          this.AppCenterCrashes.lastSessionCrashReport().then(report => {
            console.log('Crash report', report);
          });
        });
        this.appCenterAnalytics.setEnabled(true).then(() => {
          this.appCenterAnalytics.trackEvent('APP 打开', { TEST: global.userinfo ? global.userinfo.username : '无名氏' }).then(() => {
            console.log('Custom event tracked');
          });
        });
      }
    });

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
        this.rebirthProvider.headers({ Authorization: this.global.token }, true);
        this.rebirthProvider.addResponseErrorInterceptor(err => {
          console.error('请求错误！', err);
        });
        this.userService.auth().subscribe(data => {
          if (data && data.status && data.status !== 'fail') {
            this.chatIO.login(this.global.userinfo._id);
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

  /**
   * 物理键返回事件
   */
  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      const activePortal =
        this.ionicApp._modalPortal.getActive() ||
        this.ionicApp._toastPortal.getActive() ||
        this.ionicApp._loadingPortal.getActive() ||
        this.ionicApp._overlayPortal.getActive();
      if (activePortal) {
        activePortal.dismiss().catch(() => { });
        activePortal.onDidDismiss(() => { });
        return;
      }
      const activeNav = this.app.getActiveNav();
      return activeNav.canGoBack() ? activeNav.pop() : this.showExit();
    }, 1);
  }

  /**
   * 确认是否关闭 App
   */
  showExit() {
    if (this.backButtonPressed) {
      this.platform.exitApp();
    } else {
      this.toastCtrl
        .create({
          message: '再按一次退出应用',
          duration: 2000,
          position: 'top',
        })
        .present();
      this.backButtonPressed = true;
      setTimeout(() => (this.backButtonPressed = false), 2000);
    }
  }
}
