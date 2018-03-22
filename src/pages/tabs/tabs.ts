import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Tabs } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab0Root: any = 'IndexPage';
  tab1Root: any = 'FriendPage';
  tab2Root: any = 'MinePage';
  tab3Root: any = 'MessagePage';

  @ViewChild('myTabs') myTabs: Tabs;

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'zh']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|zh/) ? browserLang : 'en');
  }

  ionViewDidEnter() {
    //  this.myTabs.select(0);
  }
}
