import { Component, OnInit } from '@angular/core';

declare var window;

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
