import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { FriendPage } from './friend';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

import { ContactsPage } from './contacts/contacts';
import { WaveSideBarComponentModule } from '@components/wave-side-bar/wave-side-bar.module';
import { ScrollHeightDirective } from '@directives/scroll-height.directive';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { FriendInfoPage } from './friendinfo/friendinfo';
import { FriendTomatoesPage } from './friendinfo/friend-tomatoes/friend-tomatoes';
import { SearchPage } from './search/search';
import { SearchUserPage } from './search/searchUser/searchUser';
import { HistoryTomatoPage } from './search/historyTomato/historyTomato';

import { FriendPageRoutingModule } from './friend.router.module';


@NgModule({
  declarations: [
    FriendPage,
    ContactsPage,
    ScrollHeightDirective,
    FriendInfoPage,
    FriendTomatoesPage,
    SearchPage,
    SearchUserPage,
    HistoryTomatoPage
  ],
  imports: [
    IonicModule,
    WaveSideBarComponentModule,
    CoreModule, SharedModule,
    FriendPageRoutingModule
  ],
  providers: [QRScanner],
})
export class FriendPageModule { }
