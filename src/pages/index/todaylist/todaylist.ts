import { Component, OnInit } from '@angular/core';

import { App, Events } from 'ionic-angular';
import { OnlineTomatoService } from '../../../providers/data.service';
import { VoicePlayService } from '../../../providers/utils/voiceplay.service';
import { GlobalService } from '../../../providers/global.service';
import { TomatoIOService } from '../../../providers/utils/socket.io.service';
import { Helper } from '../../../providers/utils/helper';

@Component({
  selector: 'todaylist',
  templateUrl: 'todaylist.html',
})
export class TodaylistComponent implements OnInit {
  historyTomatoes: Array<any> = [];
  tomatoCount = 0;
  tomatoCount_time = 0;
  voicePlaySrc = './assets/voice/voice.png';

  constructor(
    public tomatoIO: TomatoIOService,
    private helper: Helper,
    public globalservice: GlobalService,
    public tomatoservice: OnlineTomatoService,
    public voiceService: VoicePlayService,
    public app: App,
    public events: Events
  ) {
    console.log('Hello TodaylistComponent Component');
  }

  ngOnInit() {
    // 加载今日番茄钟
    this.loadTomatoes();
    this.initTomatoIO();

    this.events.subscribe('tomato:added', tomato => {
      this.historyTomatoes.push(tomato);
      this.tomatoCount += 1;
      const minutes = this.helper.minuteSpan(tomato.startTime, new Date());
      this.tomatoCount_time += minutes;
    });

    this.events.subscribe('tomato:refreshTodayTomato', refresher => {
      this.loadTomatoes(refresher);
    });
  }

  initTomatoIO() {
    // 服务端新增
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
    this.tomatoservice.getTodayTomatos().subscribe(data => {
      if (refresher) {
        refresher.complete();
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
      } else {
        // token 过期
        this.app.getRootNav().setRoot(
          'LoginPage',
          {
            username: this.globalservice.userinfo.username,
            password: this.globalservice.userinfo.password,
          },
          {},
          () => {
            this.globalservice.userinfo = '';
            this.globalservice.token = '';
          }
        );
      }
    });
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
        .catch(e => {});
    } else {
      alert('此番茄钟无音频记录！');
    }
  }
}
