import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { VoicePlayService } from '@providers/utils/voiceplay.service';
import { AlertController, Events } from 'ionic-angular';
import { AngularRoundProgressDirective } from '@directives/angular-round-progress.directive';

import { GlobalService } from '@providers/global.service';
import { TomatoIOService } from '@providers/utils/socket.io.service';
import { Helper } from '@providers/utils/helper';

@Component({
  selector: 'cmp-index-index',
  templateUrl: 'index.html',
})
export class IndexIndexPage implements OnInit, AfterViewInit {
  userid: string;
  userBio: string;
  notifyID = 0;
  restnotifyID = 10000;
  currentTask = {
    title: '',
  };
  showWhiteNoiseIcon = false;
  whiteNoiseIsplaying = false;

  countdown = 25;
  resttime = 5;
  mytimeout: any = null;
  activeTomato: any = null;
  isResting = false;
  resttimeout: any = null;
  resttimestart: any = null;
  timerStatus = {
    label: this.countdown + ':00',
    countdown: this.countdown,
    percentage: 0,
    count: 0,
    reset() {
      this.count = 0;
      this.percentage = 0;
      this.label = this.countdown + ':00';
    },
  };
  breakReason: any;
  UIRefreshIntervalID: any;

  @ViewChild(AngularRoundProgressDirective)
  child: AngularRoundProgressDirective;

  constructor(
    public events: Events,
    public globalservice: GlobalService,
    public tomatoIO: TomatoIOService,
    public alertCtrl: AlertController,
    public voiceService: VoicePlayService,
    private localNotifications: LocalNotifications,
    private helper: Helper
  ) {}

  ngOnInit() {
    this.userid = this.globalservice.userinfo.username;
    if (this.globalservice.userinfo.bio) {
      this.userBio = this.globalservice.userinfo.bio;
    } else {
      this.userBio = '';
    }
    this.events.subscribe('bio:update', bio => {
      this.userBio = bio;
    });
    this.countdown = this.globalservice.countdown;
    this.timerStatus.countdown = this.countdown;
    this.timerStatus.label = this.countdown + ':00';
    this.resttime = this.globalservice.resttime;
    this.globalservice.settingState.subscribe(settings => {
      this.countdown = settings.countdown;
      this.timerStatus.label = this.countdown + ':00';
      this.timerStatus.countdown = this.countdown;
      this.resttime = settings.resttime;
      this.refreshTimeUI();
    });

    this.initTomatoIO();

    this.events.subscribe('tomato:startTask', task => {
      this.startTask(task, true);
    });
  }

  ngAfterViewInit() {
    this.refreshTimeUI();
  }

  initTomatoIO() {
    this.tomatoIO.load_tomato(this.userid);
    this.tomatoIO.load_tomato_succeed().subscribe(t => {
      if (t && t !== 'null') {
        this.startTask(t, false);
      }
    });
    this.tomatoIO.other_end_start_tomato().subscribe(t => {
      if (t && t !== 'null') {
        this.startTask(t, false);
      }
    });
    this.tomatoIO.other_end_break_tomato().subscribe(data => {
      this.breakActiveTask(false);
    });
  }

  startTask(task: any, raw: Boolean) {
    this.activeTomato = task;
    this.currentTask = JSON.parse(JSON.stringify(task));
    if (raw) {
      this.tomatoIO.start_tomato(this.userid, task, this.countdown);
      this.activeTomato.startTime = new Date();
    } else {
      this.activeTomato.startTime = new Date(this.activeTomato.startTime);
    }
    this.startTimer();
    const that = this;
  }

  /**
   * 开启番茄计时
   */
  startTimer() {
    this.refreshTimeUI();
    this.isResting = false;
    if (typeof this.resttimeout !== 'undefined') {
      clearTimeout(this.resttimeout);
    }
    if (typeof this.mytimeout !== 'undefined') {
      clearTimeout(this.mytimeout);
    }
    this.timerStatus.reset();
    this.mytimeout = setTimeout(this.onTimeout.bind(this), 1000);

    if (this.restnotifyID > 10000) {
      this.localNotifications.cancel(this.restnotifyID).then(() => {});
    }
    this.notifyID += 1;
    this.localNotifications.schedule({
      id: this.notifyID,
      title: this.activeTomato.title,
      text: '你又完成了一个番茄钟!',
      trigger: {
        at: new Date(
          this.activeTomato.startTime.getTime() + this.countdown * 60 * 1000
        ),
      },
      led: 'FF0000',
      sound: 'file://assets/audios/start.wav',
      badge: 1,
    });

    this.showWhiteNoiseIcon = true;
    this.startPlayWhiteNoise();
  }

  onTimeout() {
    const datenow: number = new Date().getTime();
    const startTime: number = this.activeTomato.startTime.getTime();
    const dataspan: number = datenow - startTime;

    const secondspan: number = dataspan / 1000;
    const percentage = dataspan / (this.countdown * 60 * 1000);

    this.timerStatus.percentage = percentage;
    this.timerStatus.label = this.helper.secondsToMMSS(
      this.countdown * 60 - parseInt(secondspan + '', 10)
    );
    if (dataspan >= this.countdown * 60 * 1000) {
      this.startRestTimer(new Date(startTime + this.countdown * 60 * 1000));
      this.activeTomato = null;
      this.showWhiteNoiseIcon = false;
      this.stopPlayWhiteNoise();
      this.voiceService.play_local_voice('assets/audios/alert.mp3');
    } else {
      this.mytimeout = setTimeout(this.onTimeout.bind(this), 1000);
    }
  }

  startRestTimer(resttimestart) {
    this.refreshTimeUI();
    this.resttimestart = resttimestart;
    if (typeof this.resttimeout !== 'undefined') {
      clearTimeout(this.resttimeout);
      this.timerStatus.reset();
    }
    this.isResting = true;
    this.resttimeout = setTimeout(this.onRestTimeout.bind(this), 1000);
    this.restnotifyID += 1;
    this.localNotifications.schedule({
      id: this.restnotifyID,
      text: '休息完了，赶紧开启下一个番茄钟吧!',
      trigger: {
        at: new Date(new Date().getTime() + 5 * 60 * 1000),
      },
      sound: 'file://assets/audios/finish.wav',
      led: 'FF0000',
    });
  }

  onRestTimeout() {
    const datenow: number = new Date().getTime();
    const startTime: number = this.resttimestart.getTime();
    const dataspan: number = datenow - startTime;

    const secondspan: number = dataspan / 1000;
    const percentage = dataspan / (this.resttime * 60 * 1000);

    this.timerStatus.percentage = percentage;
    this.timerStatus.label = this.helper.secondsToMMSS(
      this.resttime * 60 - parseInt(secondspan + '', 10)
    );

    if (dataspan >= this.resttime * 60 * 1000) {
      this.isResting = false;
      this.timerStatus.reset();
      setTimeout(this.stopRefreshTimeUI, 3500);
      this.voiceService.play_local_voice('assets/audios/alert.mp3');
    } else {
      this.resttimeout = setTimeout(this.onRestTimeout.bind(this), 1000);
    }
  }

  stopTimer() {
    clearTimeout(this.mytimeout);
    this.timerStatus.reset();
    if (this.notifyID > 0) {
      this.localNotifications.cancel(this.notifyID).then(() => {});
    }
    this.activeTomato = null;
    this.showWhiteNoiseIcon = false;
    this.stopPlayWhiteNoise();
    this.stopRefreshTimeUI();
  }

  stopPlayWhiteNoise() {
    this.whiteNoiseIsplaying = false;
    this.voiceService.stop_local_voice();
  }

  startPlayWhiteNoise() {
    this.whiteNoiseIsplaying = true;
    this.voiceService.play_local_voice('assets/audios/white_noise.mp3', true);
  }

  /**
   * 中断
   * @param isLocal 是否本地中断
   */
  breakActiveTask(isLocal) {
    if (isLocal) {
      this.showBreakPrompt();
    } else {
      this.stopTimer();
      this.startRestTimer(new Date());
    }
  }

  showBreakPrompt() {
    const prompt = this.alertCtrl.create({
      title: '中断当前番茄钟',
      message: '(可以为空)',
      inputs: [
        {
          name: 'title',
          placeholder: '请填写中断原因...',
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {
            console.log('Cancel clicked');
          },
        },
        {
          text: '提交',
          handler: data => {
            const tomatoDTO: any = {
              taskid: this.activeTomato._id,
              num: this.activeTomato.num,
              breakTime: 1,
              breakReason: data.title,
            };
            const tomato: any = {
              title: this.activeTomato.title,
              startTime: this.activeTomato.startTime,
              endTime: new Date(),
              breakTime: 1,
              breakReason: data.title,
            };
            this.events.publish('tomato:added', Object.assign({}, tomato));
            this.tomatoIO.break_tomato(this.userid, tomatoDTO);
            this.stopTimer();
            this.startRestTimer(new Date());
          },
        },
      ],
    });
    prompt.present();
  }

  refreshTimeUI() {
    clearInterval(this.UIRefreshIntervalID);
    this.UIRefreshIntervalID = setInterval(() => {
      this.child.timerStatusValue = this.timerStatus;
      this.child.render();
    }, 1000);
  }

  stopRefreshTimeUI() {
    clearInterval(this.UIRefreshIntervalID);
  }
}
