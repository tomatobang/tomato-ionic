import { NgModule } from '@angular/core';
import { IonicPageModule,IonicModule } from 'ionic-angular';
import { MinePage } from './mine';
import { Camera } from '@ionic-native/camera';

@NgModule({
    declarations: [
        MinePage
    ],
    imports: [
        IonicPageModule.forChild(MinePage),
    ],
    entryComponents:[MinePage],
    providers:[Camera],
    exports: [
        MinePage
    ]
})
export class MinePageModule {}
