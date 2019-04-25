import { Component, ViewChildren, QueryList } from '@angular/core';
import {
  Platform,
  ToastController,
  ModalController,
  ActionSheetController,
  PopoverController,
  IonRouterOutlet,
  MenuController,
  LoadingController,
  NavController
} from '@ionic/angular';
import { Router } from '@angular/router';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { JPush } from '@jiguang-ionic/jpush/ngx'
import { RebirthHttpProvider } from 'rebirth-http';

import { GlobalService } from '@services/global.service';
import { UpdateService } from '@services/update.service';
import { NativeService } from '@services/native.service';
import { TranslateService } from '@ngx-translate/core';
import { EmitService } from '@services/emit.service';
import { OnlineUserService } from '@services/data.service';
import { InfoService } from '@services/info.service';
import { ChatIOService } from '@services/utils/socket.io.service';
import { TabsService } from '@services/tab.service';

import { CodePush, SyncStatus } from '@ionic-native/code-push/ngx';
import { DEBUG, CODE_PUSH_DEPLOYMENT_KEY } from './constants';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class MyApp {
  backButtonPressed = false;
  statubarHeight = '0px';

  pages: Array<{ title: string; component: any }>;

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  @ViewChildren(IonRouterOutlet)
  routerOutlets: QueryList<IonRouterOutlet>;

  selectedTheme: String;

  constructor(
    private jPush: JPush,
    private codePush: CodePush,
    private backgroundMode: BackgroundMode,
    private menuCtrl: MenuController,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private navCtrl: NavController,
    private rebirthProvider: RebirthHttpProvider,
    private router: Router,
    private info: InfoService,
    private chatIO: ChatIOService,
    private userService: OnlineUserService,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private native: NativeService,
    private updateService: UpdateService,
    private translateservice: TranslateService,
    private globalservice: GlobalService,
    private emitservice: EmitService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private tabService: TabsService, // please don't move
  ) {
    this.emitservice.getActiveTheme().subscribe(val => {
      if (val) {
        this.selectedTheme = val;
      }
    });
    this.initializeApp();
    this.initTranslate();
    this.initRoute();
    this.codeSync();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleDefault();
      // 为 ture 时会有 bug, see: https://github.com/apache/cordova-plugin-statusbar/pull/128
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#BFf4f5f8');
      if (window.cordova) {
        // window.Transparentstatusbar.init(result => {
        //   if (result > 0) {
        //     this.statubarHeight = result + 'px';
        //   }
        // });
        this.native.initNativeService();
        this.updateService.checkUpdate();
        this.registerBackButtonAction();
        this.native.initAppCenter();
        if (this.globalservice.userinfo) {
          this.jPush.init();
          this.jPush.setDebugMode(true);
          const jpushAlias = {
            sequence: new Date().getTime(),
            alias: this.globalservice.userinfo._id,
          };
          this.globalservice.jpushAlias = JSON.stringify(jpushAlias);
          this.jPush.setAlias(jpushAlias).then((args) => {
            console.log('jpush setAlias succeed:', args);
            this.native.initJPush();
            this.native.submitEvent('jpushInit', {
              username: this.globalservice.userinfo.username
            });
          }).catch(err => {
            console.log('jpush setAlias error:', err);
          });
        }
        this.backgroundMode.disable();
      }
    });

    this.emitservice.qrcodeEmit.subscribe((ret) => {
      if (ret === 'qrScanner:show') {
        // TODO
      } else if (ret === 'qrScanner:hide') {
        // TODO
      }
    });

  }

  initRoute() {
    if (this.globalservice.isFirstTimeOpen) {
      this.globalservice.isFirstTimeOpen = false;
      this.navCtrl.navigateForward(['guide']);
    } else {
      if (this.globalservice.userinfo) {
        this.rebirthProvider.headers({ Authorization: this.globalservice.token }, true);
        this.rebirthProvider.addResponseErrorInterceptor(err => {
          console.error('request error:', err);
        });

        this.userService.auth().subscribe(data => {
          if (data && data.status && data.status !== 'fail') {
            this.chatIO.login(this.globalservice.userinfo._id, this.globalservice.token);
            this.info.init();
            this.navCtrl.navigateForward(['tabs']);
          } else {
            this.navCtrl.navigateForward(['login'], {
              queryParams: {
                username: this.globalservice.userinfo.username,
                password: this.globalservice.userinfo.password,
              }
            });
          }
        });

      } else {
        this.navCtrl.navigateForward(['login']);
      }
    }
  }

  initTranslate() {
    this.translateservice.addLangs(['en', 'zh']);
    this.translateservice.setDefaultLang('en');
    if (this.globalservice.languageType) {
      this.translateservice.use(this.globalservice.languageType);
    } else {
      const browserLang = this.translateservice.getBrowserLang();
      this.translateservice.use(
        browserLang.match(/en|zh/) ? browserLang : 'en'
      );
    }

    this.emitservice.eventEmit.subscribe(val => {
      if (val === 'languageType') {
        this.translateservice.use(this.globalservice.languageType);
      }
    });
  }

  /**
   * register hardware backbutton event
   */
  registerBackButtonAction() {
    this.platform.backButton.subscribeWithPriority(9999,async () => {
      // close action sheet
      try {
        const element = await this.actionSheetCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) { }

      // close popover
      try {
        const element = await this.popoverCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) { }

      // close modal
      try {
        const element = await this.modalCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) {
        console.log(error);
      }

      // close side menua
      try {
        const element = await this.menuCtrl.getOpen();
        if (element) {
          this.menuCtrl.close();
          return;
        }
      } catch (error) { }

      this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
        const back_button_off = ['/tabs/footprint', '/tabs/tomato', '/tabs/bill', '/tabs/ngrxtodo', '/tabs/friend', '/tabs/me'];
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if (back_button_off.includes(this.router.url)) {
          if (
            new Date().getTime() - this.lastTimeBackPress <
            this.timePeriodToExit
          ) {
            navigator['app'].exitApp(); // work in ionic 4
          } else {
            const toast = await this.toastCtrl.create({
              message: '再按一次退出应用',
              duration: 2000,
              position: 'top',
            });
            await toast.present();
            this.lastTimeBackPress = new Date().getTime();
          }
        }
      });
    });
  }

  /**
   * code hot load
   */
  loading: any;
  codeSync() {
    if (!this.isMobile()) {
      return
    }
    let deploymentKey = '';
    if (this.isAndroid() && DEBUG.IS_DEBUG) {
      deploymentKey = CODE_PUSH_DEPLOYMENT_KEY.ANDROID.Staging;
    }
    if (this.isAndroid() && !DEBUG.IS_DEBUG) {
      deploymentKey = CODE_PUSH_DEPLOYMENT_KEY.ANDROID.Production;
    }
    if (this.isIos() && DEBUG.IS_DEBUG) {
      deploymentKey = CODE_PUSH_DEPLOYMENT_KEY.IOS.Staging;
    }
    if (this.isIos() && !DEBUG.IS_DEBUG) {
      deploymentKey = CODE_PUSH_DEPLOYMENT_KEY.IOS.Production;
    }
    this.codePush.sync({
      deploymentKey: deploymentKey,
      updateDialog: {
        optionalUpdateMessage: '应用有更新哦！',
        updateTitle: '提示',
        optionalInstallButtonLabel: '立即更新',
        optionalIgnoreButtonLabel: '取消',
      }
    }, (progress) => { // download progress
      const downloadProgress = window.parseInt(
        (progress.receivedBytes / progress.totalBytes) * 100,
        10
      );
      console.log(`Downloaded ${downloadProgress} %`);
      if (this.loading) {
        this.loading.message = `已下载${downloadProgress}%`;
      }
    }).subscribe(async (syncStatus: SyncStatus) => {
      console.log('code syncStatus', syncStatus);
      if (syncStatus === SyncStatus.DOWNLOADING_PACKAGE) {

        this.loading = await this.loadingCtrl.create({
          message: `下载中...`,
        });
        await this.loading.present();
      }
      if (syncStatus === SyncStatus.UPDATE_INSTALLED) {
        await this.codePush.restartApplication();
      }
    });
  }

  isMobile(): boolean {
    return this.platform.is("mobile") && !this.platform.is("mobileweb");
  }

  isAndroid(): boolean {
    return this.isMobile() && this.platform.is("android");
  }

  isIos(): boolean {
    return this.isMobile && (this.platform.is("ios") || this.platform.is("ipad") || this.platform.is("iphone"));
  }
}
