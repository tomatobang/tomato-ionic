import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { Camera } from '@ionic-native/camera';

import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Helper } from '../../../../providers/utils/helper';
import { NativeService } from '../../../../providers/utils/native.service';
import { OnlineUserService } from '../../../../providers/data.service';

@NgModule({
  declarations: [ProfilePage],
  imports: [IonicPageModule.forChild(ProfilePage)],
  providers: [
    Camera,
    FileTransfer,
    File,
    Helper,
    NativeService,
    OnlineUserService
  ]
})
export class ProfilePageModule {}
