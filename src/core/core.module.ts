/** TODO:
 * 统一管理系统中通用服务
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoService } from '@providers/info.service';
import { GlobalService } from '@providers/global.service';
import { CacheService } from '@providers/cache.service';
import { QiniuUploadService } from '@providers/qiniu.upload.service';
import { JPushService } from '@providers/utils/jpush.service';
import { UpdateService } from '@providers/utils/update.service';
import { MessageService } from '@providers/data/message/message.service';
import { OnlineUserService } from '@providers/data.service';

import { Helper } from '@providers/utils/helper';
import { NativeService } from '@providers/utils/native.service';

import {
  TomatoIOService,
  ChatIOService,
} from '@providers/utils/socket.io.service';
import { UserFriendService } from '@providers/data/user_friend';

@NgModule({
  imports: [CommonModule],
  exports: [],
  declarations: [],
  providers: [
    NativeService,
    Helper,
    JPushService,
    UpdateService,
    GlobalService,
    QiniuUploadService,
    TomatoIOService,
    ChatIOService,
    UserFriendService,
    MessageService,
    InfoService,
    CacheService,
    OnlineUserService,
  ],
})
export class CoreModule {}
