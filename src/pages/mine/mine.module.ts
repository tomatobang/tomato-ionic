import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinePage } from './mine';

import { NativeService } from '@providers/utils/native.service';
import { OnlineUserService } from '@providers/data.service';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Helper } from '@providers/utils/helper';

@NgModule({
  declarations: [MinePage],
  imports: [IonicPageModule.forChild(MinePage)],
  entryComponents: [MinePage],
  providers: [
    FileTransfer,
    File,
    Helper,
    NativeService,
    OnlineUserService
  ],
  exports: [MinePage]
})
export class MinePageModule {}
