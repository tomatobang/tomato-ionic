/** TODO:
 * 统一的管理系统中通用的服务
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GlobalService} from '@providers/global.service';
import {QiniuUploadService} from '@providers/qiniu.upload.service';
import {JPushService} from '@providers/utils/jpush.service';
import {UpdateService} from '@providers/utils/update.service';

import {Helper} from '@providers/utils/helper';
import {NativeService} from '@providers/utils/native.service';

import {TomatoIOService, ChatIOService, ChatSocket, TomatoSocket} from '@providers/utils/socket.io.service';

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
    ChatSocket,
    TomatoSocket
  ]
})
export class CoreModule {}
