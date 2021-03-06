/**
 * 统一管理通用服务
 */

import { NgModule } from '@angular/core';

import { CodePush } from '@ionic-native/code-push/ngx';
import { Media } from '@ionic-native/media/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Network } from '@ionic-native/network/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AppCenterAnalytics } from '@ionic-native/app-center-analytics/ngx';
import { AppCenterCrashes } from '@ionic-native/app-center-crashes/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { RebirthHttpProvider } from 'rebirth-http';
import { JPush } from '@jiguang-ionic/jpush/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { VideoPlayer } from '@ionic-native/video-player/ngx';

import { GlobalService } from '@services/global.service';
import { QiniuUploadService } from '@services/qiniu.upload.service';
import { UpdateService } from '@services/update.service';
import { NativeService } from '@services/native.service';
import { DataService } from '@services/data.service';
import { BaiduLocationService } from '@services/baidulocation.service';
import { EmitService } from '@services/emit.service';
import { VoicePlayService } from '@services/utils/voiceplay.service';
import { Helper } from '@services/utils/helper';

import { CacheService } from '@services/cache.service';
import { MessageService } from '@services/data/message/message.service';

import { OnlineUserService } from '@services/data.service';
import { OnlineTomatoService } from '@services/data.service';
import { OnlineTaskService } from '@services/data.service';
import { OnlineTodoService } from '@services/data.service';
import { OnlineFootprintService } from '@services/data.service';
import { OnlineAssetService } from '@services/data.service';
import { OnlineBillService } from '@services/data.service';

import { TabsService } from '@services/tab.service';
import { UserFriendService } from '@services/data/user_friend';

@NgModule({
  exports: [],
  declarations: [],
  providers: [
    StatusBar,
    SplashScreen,
    BackgroundMode,
    File,
    Media,
    JPush,
    FileTransfer,
    FileOpener,
    Insomnia,
    Network,
    CodePush,
    AppCenterAnalytics,
    AppCenterCrashes,
    LocalNotifications,
    PhotoViewer,
    MediaCapture,
    VideoEditor,
    WebView,
    AndroidPermissions,
    VideoPlayer,
    RebirthHttpProvider,
    NativeService,
    UpdateService,
    GlobalService,
    QiniuUploadService,
    DataService,
    BaiduLocationService,
    EmitService,
    CacheService,
    MessageService,
    OnlineUserService,
    OnlineTomatoService,
    OnlineTaskService,
    OnlineTodoService,
    OnlineFootprintService,
    OnlineAssetService,
    OnlineBillService,
    Helper,
    UserFriendService,
    VoicePlayService,
    TabsService
  ],
})
export class CoreModule { }
