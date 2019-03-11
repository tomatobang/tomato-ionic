import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/footprint',
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
        path: 'bill',
        children: [
          {
            path: '',
            loadChildren: '../pages/bill/bill.module#BillPageModule'
          },
        ]
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
    redirectTo: '/tabs/footprint',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
