/*
 * @Author: kobepeng 
 * @Date: 2017-12-02 11:17:00 
 * @Last Modified by:   kobepeng 
 * @Last Modified time: 2017-12-02 11:17:00 
 */
import { NgModule } from '@angular/core';
import { IonicPageModule,IonicModule } from 'ionic-angular';
import { MinePage } from './mine';

import { JPushService } from '../../providers/utils/jpush.service';
import { NativeService } from '../../providers/utils/native.service';
import { OnlineUserService } from "../../providers/data.service";
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Helper } from '../../providers/utils/helper';

@NgModule({
    declarations: [
        MinePage
    ],
    imports: [
        IonicPageModule.forChild(MinePage),
    ],
    entryComponents:[MinePage],
    providers:[FileTransfer,File,Helper,NativeService,JPushService,OnlineUserService],
    exports: [
        MinePage
    ]
})
export class MinePageModule {}
