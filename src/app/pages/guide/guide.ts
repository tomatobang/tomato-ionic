import { Component, ViewChild } from '@angular/core';

import {
  MenuController,
  Slides,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/Storage';

@Component({
  selector: 'cmp-guide',
  templateUrl: 'guide.html'
})
export class GuidePage {
  showSkip = true;

  @ViewChild('slides') slides: Slides;

  constructor(
    private menu: MenuController,
    private storage: Storage,
    private router : Router
  ) { }

  startApp() {
    // this.navCtrl.push('LoginPage').then(() => {
    //   this.storage.set('hasSeenGuide', 'true');
    // });
    // this.router.navigate(['login'])
    // this.router.navigateByUrl('login');
  }

  onSlideChangeStart(slider: Slides) {
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
