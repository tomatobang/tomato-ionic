import { Component, ViewChild, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Tabs } from 'ionic-angular';
import { InfoService } from '@providers/info.service';

@IonicPage()
@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage implements OnInit {
  tab0Root: any = 'IndexPage';
  tab1Root: any = 'FriendPage';
  tab2Root: any = 'MinePage';
  tab3Root: any = 'MessagePage';

  messsageBadge = 0;

  @ViewChild('myTabs') myTabs: Tabs;

  constructor(private translate: TranslateService, public info: InfoService) {
    translate.addLangs(['en', 'zh']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|zh/) ? browserLang : 'en');
  }
  ngOnInit(): void {
    this.info.messageCountMonitor.subscribe(data => {
      this.messsageBadge = data;
    });
  }

  ionViewDidEnter() {
    //  this.myTabs.select(0);
  }
}
