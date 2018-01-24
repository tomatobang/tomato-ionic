import { Component, ViewChild } from '@angular/core';

import { IonicPage, Tabs } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab0Root: any = 'IndexPage';
  tab1Root: any = 'FriendPage';
  tab2Root: any = 'MinePage';
  // TESTRoot: any = 'TestPage';
  @ViewChild('myTabs') tabRef: Tabs;

  ionViewDidEnter() {
    this.tabRef.select(0);
  }

  constructor() {}
}
