import { Component, ViewChild, OnInit } from '@angular/core';
import {
  ModalController,
  Events,
  NavController
} from '@ionic/angular';
import { GlobalService } from '@services/global.service';
import { TaskPage } from './task/task';
import { EmitService } from '@services/emit.service';
import { OnlineTomatoService } from '@services/data.service';
import { VoicePlayService } from '@services/utils/voiceplay.service';
import { TomatoIOService } from '@services/utils/socket.io.service';
import { Helper } from '@services/utils/helper';

@Component({
  selector: 'page-tomato',
  templateUrl: 'tomato.html',
  styleUrls: ['./tomato.scss']
})
export class TomatoPage implements OnInit {
  slideOpts = {
    effect: 'flip'
  };
  page_title = '番茄';
  segment = 'index';
  @ViewChild('tomato_slides') slides;
  IsInTomatoTodaySlide = false;

  historyTomatoes: Array<any> = [];
  tomatoCount = 0;
  tomatoCount_time = 0;
  voicePlaySrc = './assets/voice/voice.png';

  constructor(
    public events: Events,
    public modalCtrl: ModalController,
    public globalservice: GlobalService,
    public tomatoIO: TomatoIOService,
    public tomatoservice: OnlineTomatoService,
    public voiceService: VoicePlayService,
    private emitService: EmitService,
    private helper: Helper,
    private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
    this.loadTomatoes();

    this.events.subscribe('tomato:added', tomato => {
      this.historyTomatoes.unshift(tomato);
      this.tomatoCount += 1;
      const minutes = this.helper.minuteSpan(tomato.startTime, new Date());
      this.tomatoCount_time += minutes;
    });

    this.events.subscribe('tomatoio:load_tomato_succeed', () => {
      this.initTomatoIO();
    });

    this.emitService.getActiveUser().subscribe(ret => {
      this.loadTomatoes();
    });
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

  initTomatoIO() {
    this.tomatoIO.new_tomate_added().subscribe(t => {
      if (t && t !== 'null') {
        this.historyTomatoes.unshift(t);
        this.tomatoCount += 1;
        const minutes = this.helper.minuteSpan(t.startTime, t.endTime);
        this.tomatoCount_time += minutes;
      } else {
        this.loadTomatoes();
      }
    });
  }

  /**
   * 刷新今日番茄
   * @param refresher
   */
  doRefreshTodayTomato(refresher) {
    this.loadTomatoes(refresher);
  }

  loadTomatoes(refresher?) {
    this.tomatoservice.getTodayTomatos(this.globalservice.token).subscribe(
      data => {
        if (refresher) {
          refresher.target.complete();
        }
        const list = data;
        if (Array.isArray(list)) {
          this.historyTomatoes = list;
          this.tomatoCount = list.length;
          this.tomatoCount_time = 0;
          for (let i = 0; i < list.length; i++) {
            if (list[i].startTime && list[i].endTime) {
              const minutes = this.helper.minuteSpan(
                list[i].startTime,
                list[i].endTime
              );
              this.tomatoCount_time += minutes;
            }
          }
        }
      },
      err => {
        console.error(err);
        if (refresher) {
          alert(err);
          refresher.target.complete();
        }
      }
    );
  }

  playVoiceRecord(tomato) {
    if (tomato.voiceUrl) {
      const fileNamePart = this.helper.getFileName(tomato.voiceUrl);
      this.voiceService
        .downloadVoiceFile(
          fileNamePart,
          this.globalservice.qiniuDomain + fileNamePart
        )
        .then(filename => {
          this.voicePlaySrc = './assets/voice/voice_play_me.gif';
          this.voiceService.play(filename).then(() => {
            this.voicePlaySrc = './assets/voice/voice.png';
          });
        })
        .catch(e => { });
    } else {
      alert('此番茄钟无音频记录！');
    }
  }

  setting() {
    this.navCtrl.navigateForward(['tabs/tomato/tomatosetting']);
  }
}
