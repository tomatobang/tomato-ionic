import { Component, OnInit, ViewChild } from '@angular/core';

import { IonicPage } from 'ionic-angular';
// import { GlobalService } from "../../../../providers/global.service";

declare var window;
@IonicPage()
@Component({
  selector: 'cmp-about',
  templateUrl: 'about.html',
})
export class AboutPage implements OnInit {
  appversion: any;
  constructor() {
  }

  ngOnInit() {
    if (window.cordova) {
      window.cordova.getAppVersion.getVersionNumber().then(version => {
        this.appversion = version;
      });
    }
  }
}
