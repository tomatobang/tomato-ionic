/**
 * Created by hsuanlee on 2017/4/4.
 */
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinePage } from './mine';

@NgModule({
    declarations: [
        MinePage,
    ],
    imports: [
        IonicPageModule.forChild(MinePage),
    ],
    exports: [
        MinePage
    ]
})
export class MinePageModule {}