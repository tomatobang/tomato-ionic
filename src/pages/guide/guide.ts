import { Component, ViewChild } from '@angular/core';

import {
  MenuController,
  NavController,
  Slides,
  IonicPage
} from 'ionic-angular';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-guide',
  templateUrl: 'guide.html'
})
@IonicPage()
export class GuidePage {
  showSkip = true;

  @ViewChild('slides') slides: Slides;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public storage: Storage
  ) {}

  startApp() {
    this.navCtrl.push('LoginPage').then(() => {
      this.storage.set('hasSeenGuide', 'true');
    });
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.slides.update();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    // this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    // this.menu.enable(true);
  }
}
