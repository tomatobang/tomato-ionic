import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import {
  NavController,
  ViewController,
  ModalController,
  IonicPage,
  Events,
} from 'ionic-angular';

import { Slides } from 'ionic-angular';
declare let window;

@IonicPage()
@Component({
  selector: 'cmp-index',
  templateUrl: 'index.html',
})
export class IndexPage implements OnInit, OnDestroy {
  page_title = '首页';
  segment = 'index';
  @ViewChild(Slides) slides: Slides;
  IsInTomatoTodaySlide = false;

  constructor(public events: Events, public modalCtrl: ModalController) {}

  ngOnInit() {}

  ngOnDestroy() {}

  slideChanged() {
    const currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
    switch (currentIndex) {
      case 0:
        this.page_title = '首页';
        this.IsInTomatoTodaySlide = false;
        break;
      case 1:
        this.page_title = '今日番茄钟';
        this.IsInTomatoTodaySlide = true;
        break;
      default:
        this.IsInTomatoTodaySlide = false;
        break;
    }
  }

  addTask() {
    const profileModal = this.modalCtrl.create('TaskPage');
    profileModal.onDidDismiss(data => {
      if (data.task) {
        this.events.publish('tomato:startTask', data.task);
      }
    });
    profileModal.present();
  }

  /**
   * 刷新今日番茄
   * @param refresher
   */
  doRefreshTodayTomato(refresher) {
    this.events.publish('tomato:refreshTodayTomato', refresher);
  }
}
