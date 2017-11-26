import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { Camera } from '@ionic-native/camera';


@NgModule({
    declarations: [
        ProfilePage
    ],
    imports: [
        IonicPageModule.forChild(ProfilePage),
    ],
    providers: [Camera]

})
export class ProfilePageModule { }
