

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StatisticsPage } from './subpages/statistics/statistics';
import { SettingPage } from './subpages/setting/setting';
import { ProfilePage } from './subpages/profile/profile';
import { AboutPage } from './subpages/about/about';
import { MinePage } from './mine';

const routes: Routes = [
  {
    path: '',
    component: MinePage,
  },
  {
    path: 'about',
    component: AboutPage,
  },
  {
    path: 'profile',
    component: ProfilePage,
  },
  {
    path: 'setting',
    component: SettingPage,
  },
  {
    path: 'statistics',
    component: StatisticsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinePageRoutingModule { }
