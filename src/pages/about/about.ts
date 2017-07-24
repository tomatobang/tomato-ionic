import { Component, ViewChild } from '@angular/core';
import * as echarts from 'echarts';

import {NavController, IonicPage} from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
   @ViewChild(HTMLDivElement) divContainer: HTMLDivElement;

  constructor(
      public navCtrl: NavController,
  ) {

  }

   public ngOnInit(): void {
        echarts.init(this.divContainer).setOption({});
    }

}
