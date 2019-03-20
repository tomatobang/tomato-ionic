import { Component, ViewChildren, QueryList } from '@angular/core';
import {
  Platform,
  ToastController,
  Events,
  ModalController,
  ActionSheetController,
  PopoverController,
  IonRouterOutlet,
  MenuController,
} from '@ionic/angular';
import { Router } from '@angular/router';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { JPush } from '@jiguang-ionic/jpush/ngx';
import { RebirthHttpProvider } from 'rebirth-http';

import { GlobalService } from '@services/global.service';
import { UpdateService } from '@services/update.service';
import { NativeService } from '@services/native.service';
import { TranslateService } from '@ngx-translate/core';
import { EmitService } from '@services/emit.service';
import { OnlineUserService } from '@services/data.service';
import { InfoService } from '@services/info.service';
import { ChatIOService } from '@services/utils/socket.io.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class MyApp {
  backButtonPressed = false;
  hideNav = false;

  pages: Array<{ title: string; component: any }>;

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  @ViewChildren(IonRouterOutlet)
  routerOutlets: QueryList<IonRouterOutlet>;

  selectedTheme: String;

  constructor(
    private jPush: JPush,
    private backgroundMode: BackgroundMode,
    public rebirthProvider: RebirthHttpProvider,
    public info: InfoService,
    public chatIO: ChatIOService,
    public userService: OnlineUserService,
    public platform: Platform,
    public events: Events,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public global: GlobalService,
    public native: NativeService,
    public updateService: UpdateService,
    public translateservice: TranslateService,
    public globalservice: GlobalService,
    public emitservice: EmitService,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private router: Router
  ) {
    this.emitservice.getActiveTheme().subscribe(val => {
      if (val) {
        this.selectedTheme = val;
      }
    });
    this.initializeApp();
    this.initTranslate();
    this.initRoute();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#f8f8f8');
      if (window.cordova) {
        this.native.initNativeService();
        this.updateService.checkUpdate();
        this.registerBackButtonAction();
        this.native.initAppCenter();

        if (this.global.userinfo) {
          this.jPush.init();
          this.jPush.setAlias({
            sequence: new Date().getTime(),
            alias: this.global.userinfo.username,
          });
        }
        this.backgroundMode.disable();
      }
    });

    this.emitservice.qrcodeEmit.subscribe((ret) => {
      if (ret === 'qrScanner:show') {
        this.hideNav = true;
      } else if (ret === 'qrScanner:hide') {
        this.hideNav = false;
      }
    });

  }

  initRoute() {
    if (this.global.isFirstTimeOpen) {
      this.global.isFirstTimeOpen = false;
      this.router.navigate(['guide']);
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
            this.router.navigate(['tabs']);
          } else {
            this.router.navigate(['login'], {
              queryParams: {
                username: this.global.userinfo.username,
                password: this.global.userinfo.password,
              }
            });
          }
        });

      } else {
        this.router.navigate(['login']);
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
   * 物理键返回事件
   */
  registerBackButtonAction() {
    this.platform.backButton.subscribe(async () => {
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
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else { //  if (this.router.url === 'tabs/footprint') 
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

  navigate(url) {
    return this.router.navigateByUrl(url);
  }
}
