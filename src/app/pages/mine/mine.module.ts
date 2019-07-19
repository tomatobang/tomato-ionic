import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MinePage } from './mine';

import { NativeService } from '@services/native.service';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Helper } from '@services/utils/helper';
import { Camera } from '@ionic-native/camera/ngx';
import { PipesModule } from '@pipes/pipes.module';
import { MinePageRoutingModule } from './mine.router.module';
import { SharedModule } from '../../shared/shared.module';

import { StatisticsPage } from './subpages/statistics/statistics';
import { SettingPage } from './subpages/setting/setting';
import { ProfilePage } from './subpages/profile/profile';
import { AboutPage } from './subpages/about/about';
import { PopoverComponent } from './subpages/statistics/popover/popover.component';
import { UpdatemodalPage } from './subpages/updatemodal/updatemodal';
import { ChangePWDPage } from './subpages/changePWD/changePWD';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EqualValidator } from '@directives/equal-validator.directive';

@NgModule({
  declarations: [MinePage, StatisticsPage, SettingPage, ProfilePage, AboutPage, UpdatemodalPage,
    ChangePWDPage, PopoverComponent, EqualValidator],
  imports: [IonicModule, PipesModule, MinePageRoutingModule, SharedModule, FormsModule, ReactiveFormsModule],
  entryComponents: [MinePage, UpdatemodalPage, ChangePWDPage, PopoverComponent],
  providers: [
    FileTransfer,
    File,
    Camera,
    Helper,
    NativeService,
  ],
  exports: [MinePage,]
})
export class MinePageModule { }
