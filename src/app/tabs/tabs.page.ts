import { Component, OnInit } from '@angular/core';

import { GlobalService } from '@services/global.service';
import { TranslateService } from '@ngx-translate/core';
import { EmitService } from '@services/emit.service';
import { InfoService } from '@services/info.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  messsageBadge = '';

  constructor(
    public translate: TranslateService,
    public globalservice: GlobalService,
    public emit: EmitService,
    public info: InfoService
  ) {
    this.initTranslate();
  }

  ngOnInit() {
    this.info.messageCountMonitor.subscribe(data => {
      if (data !== undefined && data !== null) {
        if (data === 0) {
          this.messsageBadge = '';
        } else {
          this.messsageBadge = data;
        }
      }
    });
  }

  initTranslate() {
    this.translate.addLangs(['en', 'zh']);
    this.translate.setDefaultLang('en');
    if (this.globalservice.languageType) {
      this.translate.use(this.globalservice.languageType);
    } else {
      const browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang.match(/en|zh/) ? browserLang : 'en');
    }

    this.emit.eventEmit.subscribe(val => {
      if (val === 'languageType') {
        this.translate.use(this.globalservice.languageType);
      }
    });
  }
}
