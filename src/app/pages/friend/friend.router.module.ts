

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactsPage } from './contacts/contacts';
import { FriendInfoPage } from './friendinfo/friendinfo';
import { FriendTomatoesPage } from './friendinfo/friend-tomatoes/friend-tomatoes';
import { SearchPage } from './search/search';
import { SearchUserPage } from './search/searchUser/searchUser';
import { HistoryTomatoPage } from './search/historyTomato/historyTomato';

import { FriendPage } from './friend';

const routes: Routes = [
    {
        path: '',
        component: FriendPage,
    },
    {
        path: 'contact',
        component: ContactsPage,
    },
    {
        path: 'friendinfo',
        component: FriendInfoPage,
    },
    {
        path: 'friendtomato',
        component: FriendTomatoesPage,
    },
    {
        path: 'search',
        component: SearchPage,
    },
    {
        path: 'searchuser',
        component: SearchUserPage,
    },
    {
        path: 'historytomato',
        component: HistoryTomatoPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FriendPageRoutingModule { }
