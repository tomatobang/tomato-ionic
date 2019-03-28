import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MinePage } from './mine';

import { NativeService } from '@services/native.service';
import { OnlineUserService } from '@services/data.service';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Helper } from '@services/utils/helper';
import { Camera } from '@ionic-native/camera/ngx';
import { PipesModule } from '@pipes/pipes.module';
import { UpdatemodalPage } from './subpages/updatemodal/updatemodal';
import { MinePageRoutingModule } from './mine.router.module'
import { SharedModule } from '../../shared/shared.module';

import { StatisticsPage } from './subpages/statistics/statistics';
import { SettingPage } from './subpages/setting/setting';
import { ProfilePage } from './subpages/profile/profile';
import { AboutPage } from './subpages/about/about';
import { PopoverComponent } from './subpages/statistics/popover/popover.component';

@NgModule({
  declarations: [MinePage, StatisticsPage, SettingPage, ProfilePage, AboutPage, UpdatemodalPage, PopoverComponent],
  imports: [IonicModule, PipesModule, MinePageRoutingModule, SharedModule],
  entryComponents: [MinePage, UpdatemodalPage, PopoverComponent],
  providers: [
    FileTransfer,
    File,
    Camera,
    Helper,
    NativeService,
    OnlineUserService,
  ],
  exports: [MinePage,]
})
export class MinePageModule { }
