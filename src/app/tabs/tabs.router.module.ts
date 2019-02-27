import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { HomePage } from '../pages/home/home.page';
import { TestPage } from '../pages/test/test.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/(home:home)',
        pathMatch: 'full',
      },
      {
        path: 'tomato',
        outlet: 'tomato',
        loadChildren: '../pages/tomato/tomato.module#TomatoPageModule',
      },
      {
        path: 'home',
        outlet: 'home',
        component: HomePage,
      },
      {
        path: 'test',
        outlet: 'test',
        component: TestPage,
      },
      {
        path: 'list',
        outlet: 'list',
        loadChildren: '../pages/list/list.module#ListPageModule',
      },
      {
        path: 'friend',
        outlet: 'friend',
        loadChildren: '../pages/friend/friend.module#FriendPageModule',
      },
      {
        path: 'message',
        outlet: 'message',
        loadChildren: '../pages/message/message.module#MessagePageModule',
      },
      {
        path: 'me',
        outlet: 'me',
        loadChildren: '../pages/mine/mine.module#MinePageModule',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/(home:home)',
    pathMatch: 'full',
  },
  {
    path: 'list',
    redirectTo: '/tabs/(list:list)',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
