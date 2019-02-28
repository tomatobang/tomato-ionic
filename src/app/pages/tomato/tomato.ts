import { Component, ViewChild } from '@angular/core';
import {
  ModalController,
  Events,
} from '@ionic/angular';
import { RebirthHttpProvider } from 'rebirth-http';
import { GlobalService } from '@services/global.service';
import { TaskPage } from './task/task';

@Component({
  selector: 'page-tomato',
  templateUrl: 'tomato.html',
  styleUrls: ['./tomato.scss']
})
export class TomatoPage {
  slideOpts = {
    effect: 'flip'
  };
  page_title = '番茄';
  segment = 'index';
  @ViewChild('tomato_slides') slides;
  IsInTomatoTodaySlide = false;

  constructor(
    public events: Events,
    public modalCtrl: ModalController,
    public rebirthProvider: RebirthHttpProvider,
    public globalservice: GlobalService,
  ) {
    this.rebirthProvider.headers({ Authorization: this.globalservice.token }, true);
  }

  slideChanged() {
    this.slides.getActiveIndex().then(currentIndex => {
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
    });

  }

  async addTask() {
    const profileModal = await this.modalCtrl.create({
      component: TaskPage,
      showBackdrop: true,
    });
    profileModal.onDidDismiss().then(
      data => {
        if (data.data.task) {
          this.events.publish('tomato:startTask', data.data.task);
        }
      }
    );
    await profileModal.present();
  }

  /**
   * 刷新今日番茄
   * @param refresher
   */
  doRefreshTodayTomato(refresher) {
    this.events.publish('tomato:refreshTodayTomato', refresher);
  }
}
