import { Component, ViewChild, OnInit } from '@angular/core';
import {
  NavController,
  ActionSheetController,
  IonicPage,
  App,
  Platform,
  ModalController,
} from 'ionic-angular';
import { GlobalService } from '@providers/global.service';
import { JPushService } from '@providers/utils/jpush.service';
import { NativeService } from '@providers/utils/native.service';
import { OnlineUserService } from '@providers/data.service';

@IonicPage()
@Component({
  selector: 'cmp-mine',
  templateUrl: 'mine.html',
})
export class MinePage implements OnInit {
  userid = '';
  username = '';
  bio = '';
  headImg = './assets/tomato-active.png';
  showBigHeadImg = false;

  constructor(
    public navCtrl: NavController,
    public globalservice: GlobalService,
    public jPushService: JPushService,
    public actionSheetCtrl: ActionSheetController,
    public native: NativeService,
    public platform: Platform,
    private userservice: OnlineUserService,
    private app: App,
    private modalCtrl: ModalController
  ) {}

  public ngOnInit(): void {
    this.username = this.globalservice.userinfo.username;
    this.bio = this.globalservice.userinfo.bio;
    this.userid = this.globalservice.userinfo._id;
  }

  ionViewDidEnter() {
    if (this.globalservice.userinfo.img) {
      this.platform.ready().then(readySource => {
        if (readySource === 'cordova') {
          this.native
            .downloadHeadImg(
              this.userid,
              false,
              this.globalservice.qiniuDomain + this.globalservice.userinfo.img
            )
            .then(url => {
              this.headImg = `${url}?${new Date().getTime()}`;
            });
        }
      });
    }
  }

  logout() {
    this.app.getRootNav().setRoot(
      'LoginPage',
      {
        username: this.globalservice.userinfo.username,
        password: this.globalservice.userinfo.password,
      },
      {},
      () => {
        this.globalservice.userinfo = '';
        this.globalservice.token = '';
        this.jPushService.clearAlias();
      }
    );
  }

  setting() {
    console.log('setting!');
    this.navCtrl.push('SettingPage', {}, {}, () => {});
  }

  about() {
    console.log('about!');
    this.navCtrl.push('AboutPage', {}, {}, () => {});
  }

  profile() {
    this.navCtrl.push('ProfilePage', {}, {}, () => {});
  }

  statistics() {
    this.navCtrl.push('StatisticsPage', {}, {}, () => {});
  }

  toGameBoard() {
    this.navCtrl.push('TwoZeroFourEightPage', {}, {}, () => {});
  }

  /**
   * 显示头像大图
   */
  toShowBigHeadImg() {
    this.showBigHeadImg = true;
  }

  /**
   * 关闭头像大图
   */
  closeBigHeadImg() {
    this.showBigHeadImg = false;
  }

  /**
   * 显示二维码
   */
  showMyQRCODE() {
    const modal = this.modalCtrl.create('QRImgModal', {
      userid: this.userid,
      username: this.username,
      bio: this.bio,
      headImg: this.headImg,
    });
    modal.onDidDismiss(data => {
      return data;
    });

    modal.present();
  }
}
