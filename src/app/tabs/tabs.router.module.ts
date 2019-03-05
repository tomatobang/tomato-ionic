import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { TestPage } from '../pages/test/test.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/tomato',
        pathMatch: 'full',
      },
      {
        path: 'tomato',
        children: [
          {
            path: '',
            loadChildren: '../pages/tomato/tomato.module#TomatoPageModule',
          },
        ]
      },
      {
        path: 'test',
        outlet: 'test',
        component: TestPage,
      },
      {
        path: 'list',
        children: [
          {
            path: '',
            loadChildren: '../pages/list/list.module#ListPageModule',
          },
        ]
      },
      {
        path: 'friend',
        children: [
          {
            path: '',
            loadChildren: '../pages/friend/friend.module#FriendPageModule',
          },
        ]
      },
      // {
      //   path: 'message',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: '../pages/message/message.module#MessagePageModule',

      //     },
      //   ]
      // },
      {
        path: 'footprint',
        loadChildren: '../pages/footprint/footprint.module#FootprintPageModule'
      },
      {
        path: 'me',
        children: [
          {
            path: '',
            loadChildren: '../pages/mine/mine.module#MinePageModule',
          },
        ]
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tomato',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
