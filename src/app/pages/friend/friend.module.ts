import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { FriendPage } from './friend';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

import { ContactsPage } from './contacts/contacts';
import { ScrollHeightDirective } from '@directives/scroll-height.directive';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { FriendInfoPage } from './friendinfo/friendinfo';
import { FriendTomatoesPage } from './friendinfo/friend-tomatoes/friend-tomatoes';
import { SearchPage } from './search/search';
import { PopOverPage } from './popover/popover';
import { SearchUserPage } from './search/searchUser/searchUser';
import { HistoryTomatoPage } from './search/historyTomato/historyTomato';
import { FriendPageRoutingModule } from './friend.router.module';
import { ScrollModule } from '@components/alpha-scroll/alpha-scroll.module';
import { PinyinService } from '@services/utils/pinyin.service';

@NgModule({
  declarations: [
    FriendPage,
    PopOverPage,
    ContactsPage,
    ScrollHeightDirective,
    FriendInfoPage,
    FriendTomatoesPage,
    SearchPage,
    SearchUserPage,
    HistoryTomatoPage,
  ],
  imports: [
    IonicModule,
    CoreModule,
    SharedModule,
    FriendPageRoutingModule,
    ScrollModule
  ],
  entryComponents: [PopOverPage],
  providers: [QRScanner, PinyinService],
})
export class FriendPageModule { }
