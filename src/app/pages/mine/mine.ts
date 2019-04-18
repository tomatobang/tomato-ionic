import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, Platform, ModalController, NavController } from '@ionic/angular';
import { GlobalService } from '@services/global.service';
import { JPush } from '@jiguang-ionic/jpush/ngx';
import { NativeService } from '@services/native.service';
import { CacheService } from '@services/cache.service';
import { ChatIOService, TomatoIOService } from '@services/utils/socket.io.service';
import { OnlineUserService } from '@services/data.service';
import { SafeUrl } from '@angular/platform-browser';
import { Helper } from '@services/utils/helper';
import { QRImgModal } from '@modals/qr-img/qr-img';
import { EmitService } from '@services/emit.service';

@Component({
  selector: 'cmp-mine',
  templateUrl: 'mine.html',
  styleUrls: ['./mine.scss']
})
export class MinePage implements OnInit {
  userid = '';
  username = '';
  displayName = '';
  bio = '';
  headImg: SafeUrl;
  showBigHeadImg = false;

  constructor(
    public globalservice: GlobalService,
    public jPushService: JPush,
    public actionSheetCtrl: ActionSheetController,
    public native: NativeService,
    public platform: Platform,
    public chatIO: ChatIOService,
    public tomatoIO: TomatoIOService,
    public userService: OnlineUserService,
    private cache: CacheService,
    private modalCtrl: ModalController,
    private helper: Helper,
    private emitService: EmitService,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.setUserInfo();
    this.emitService.getActiveUser().subscribe(ret => {
      this.setUserInfo();
      this.setHeadImg(true);
    });
  }

  ionViewDidEnter() {
    this.initHeadImg();
  }

  setUserInfo() {
    this.username = this.globalservice.userinfo.username;
    this.displayName = this.globalservice.userinfo.displayName;
    this.bio = this.globalservice.userinfo.bio;
    this.userid = this.globalservice.userinfo._id;
  }

  initHeadImg() {
    if (this.globalservice.userinfo.img) {
      this.platform.ready().then(readySource => {
        this.setHeadImg(false)
      });
    }
  }

  setHeadImg(change) {
    if (window.cordova) {
      this.native.downloadHeadImg(this.userid, change, this.globalservice.qiniuDomain + this.globalservice.userinfo.img).then(url => {
        this.headImg = this.helper.dealWithLocalUrl(url);
      });
    } else {
      this.headImg = this.helper.dealWithLocalUrl(this.globalservice.qiniuDomain + this.globalservice.userinfo.img);
    }
  }

  /**
   * 登出
   */
  logout() {
    this.userService.logout().subscribe(ret => {
      this.navCtrl.navigateForward('login', {
        queryParams: {
          username: this.globalservice.userinfo.username,
          password: this.globalservice.userinfo.password,
        }
      }).then(() => {
        if (!this.globalservice.userinfo) {
          this.cache.clearCache();
          this.globalservice.token = '';
          return;
        }
        this.chatIO.logout(this.globalservice.userinfo._id);
        this.tomatoIO.logout(this.globalservice.userinfo.username);
        this.globalservice.userinfo = '';
        this.globalservice.token = '';
        this.jPushService.setBadge(0);
        this.jPushService.clearAllNotification().then(() => { });
        this.jPushService.deleteAlias(this.globalservice.jpushAlias).then((args) => {
          console.log('jpush deleteAlias succeed:', args);
        }).catch(err => {
          console.log('jpush deleteAlias error:', err);
        });
        this.cache.clearCache();
      });
    });
  }

  setting() {
    console.log('setting!');
    this.navCtrl.navigateForward(['setting'], {
      relativeTo: this.route
    });
  }

  about() {
    console.log('about!');
    this.navCtrl.navigateForward(['tabs/me/about']);
  }

  profile() {
    this.navCtrl.navigateForward(['tabs/me/profile']);
  }

  statistics() {
    this.navCtrl.navigateForward(['tabs/me/statistics']);
  }

  toGameBoard() {
    this.navCtrl.navigateForward(['tabs/me/game']);
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
  async showMyQRCODE() {
    // , {
    //   userid: this.userid,
    //   username: this.username,
    //   bio: this.bio,
    //   headImg: this.headImg,
    // }
    const modal = await this.modalCtrl.create({
      component: QRImgModal,
      showBackdrop: true,
    });

    modal.onDidDismiss().then(data => {
      return data;
    });

    await modal.present();
  }
}
