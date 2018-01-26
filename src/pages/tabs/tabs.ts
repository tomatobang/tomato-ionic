import { Component, ViewChild } from '@angular/core';

import { IonicPage, Tabs } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab0Root: any = 'IndexPage';
  tab1Root: any = 'FriendPage';
  tab2Root: any = 'MinePage';

  @ViewChild('myTabs') myTabs: Tabs;

  constructor() {}

  ionViewDidEnter() {
    //  this.myTabs.select(0);
  }
}
