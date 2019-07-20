import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GlobalService } from '@services/global.service';
import { JPush } from '@jiguang-ionic/jpush/ngx';
import { CacheService } from '@services/cache.service';
import { ChatIOService, TomatoIOService } from '@services/utils/socket.io.service';
import { OnlineUserService } from '@services/data.service';
import { InfoService } from '@services/info.service';

@Injectable({
    providedIn: 'root',
})
export class MineService {

    constructor(
        public globalservice: GlobalService,
        public jPushService: JPush,
        public chatIO: ChatIOService,
        public tomatoIO: TomatoIOService,
        public userService: OnlineUserService,
        private cacheService: CacheService,
        private infoService: InfoService,
        private navCtrl: NavController,
    ) { }

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
                    this.cacheService.clearCache();
                    this.globalservice.token = '';
                    return;
                }
                this.chatIO.logout(this.globalservice.userinfo._id);
                this.tomatoIO.logout(this.globalservice.userinfo.username);
                this.globalservice.userinfo = '';
                this.globalservice.token = '';
                this.jPushService.setBadge(0);
                this.infoService.clearUnreadMsgCount();
                this.jPushService.clearAllNotification().then(() => { });
                this.jPushService.deleteAlias(this.globalservice.jpushAlias).then((args) => {
                    console.log('jpush deleteAlias succeed:', args);
                }).catch(err => {
                    console.log('jpush deleteAlias error:', err);
                });
                this.cacheService.clearCache();
            });
        });
    }

}
