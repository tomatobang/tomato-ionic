import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController,Platform, ModalController } from '@ionic/angular';
import { GlobalService } from '@services/global.service';
import { JPush } from '@jiguang-ionic/jpush/ngx';
import { NativeService } from '@services/native.service';
import { CacheService } from '@services/cache.service';
import { ChatIOService, TomatoIOService } from '@services/utils/socket.io.service';
import { OnlineUserService } from '@services/data.service';
import { SafeUrl } from '@angular/platform-browser';
import { Helper } from '@services/utils/helper';
import { QRScannerModal } from '@modals/qr-scanner/qr-scanner';

@Component({
  selector: 'cmp-mine',
  templateUrl: 'mine.html',
  styleUrls: ['./mine.scss']
})
export class MinePage implements OnInit {
  userid = '';
  username = '';
  bio = '';
  headImg: SafeUrl;
  showBigHeadImg = false;

  constructor(
    public globalservice: GlobalService,
    public jPushService: JPush,
    public actionSheetCtrl: ActionSheetController,
    public native: NativeService,
    public platform: Platform,
    private cache: CacheService,
    private modalCtrl: ModalController,
    public chatIO: ChatIOService,
    public tomatoIO: TomatoIOService,
    public userService: OnlineUserService,
    private helper: Helper,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.username = this.globalservice.userinfo.username;
    this.bio = this.globalservice.userinfo.bio;
    this.userid = this.globalservice.userinfo._id;
  }

  ionViewDidEnter() {
    if (this.globalservice.userinfo.img) {
      this.platform.ready().then(readySource => {
        if (readySource === 'cordova') {
          this.native.downloadHeadImg(this.userid, false, this.globalservice.qiniuDomain + this.globalservice.userinfo.img).then(url => {
            this.headImg = this.helper.dealWithLocalUrl(url);
          });
        } else {
          this.headImg = this.helper.dealWithLocalUrl('./assets/tomato-active.png');
        }
      });
    }
  }

  /**
   * 登出
   */
  logout() {
    this.userService.logout().subscribe(ret => {
      this.router.navigate(['login'], {
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
        this.jPushService.deleteAlias(this.globalservice.jpushAlias);
        this.cache.clearCache();
      });
    });
  }

  setting() {
    console.log('setting!');
    this.router.navigate(['setting']);
  }

  about() {
    console.log('about!');
    this.router.navigate(['about']);
  }

  profile() {
    this.router.navigate(['profile']);
  }

  statistics() {
    this.router.navigate(['statistics']);
  }

  toGameBoard() {
    this.router.navigate(['game']);
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
      component: QRScannerModal,
      showBackdrop: true,
    });

    modal.onDidDismiss().then(data => {
      return data;
    });

    await modal.present();
  }
}
