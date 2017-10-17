import { NgModule } from '@angular/core';
import { IonicPageModule,IonicModule } from 'ionic-angular';
import { SettingPage } from './setting';


@NgModule({
    declarations: [
        SettingPage
    ],
    imports: [
        IonicPageModule.forChild(SettingPage),
    ]
})
export class SettingPageModule {}
