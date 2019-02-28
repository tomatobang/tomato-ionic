import { Component, ViewChild } from '@angular/core';

import {
  MenuController,

} from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/Storage';

@Component({
  selector: 'page-guide',
  templateUrl: 'guide.html',
  styleUrls: ['./guide.scss']
})
export class GuidePage {
  showSkip = true;

  @ViewChild('slides') slides;

  constructor(
    private menu: MenuController,
    private storage: Storage,
    private router: Router
  ) { }

  startApp() {
    this.storage.set('hasSeenGuide', 'true');
    this.router.navigate(['login'])
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.slides.update();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
}
