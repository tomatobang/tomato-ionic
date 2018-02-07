import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { VoicePlayService } from '../../providers/utils/voiceplay.service';
import {
  NavController,
  ViewController,
  ModalController,
  IonicPage,
  AlertController,
  NavParams,
  App,
} from 'ionic-angular';
import { AngularRoundProgressDirective } from '../../directives/angular-round-progress.directive';

import {
  OnlineTomatoService,
  OnlineTaskService,
} from '../../providers/data.service';
import { GlobalService } from '../../providers/global.service';
import { TomatoIOService } from '../../providers/utils/socket.io.service';

import { Slides } from 'ionic-angular';
declare let window;

@IonicPage()
@Component({
  selector: 'cmp-index',
  templateUrl: 'index.html',
})
export class IndexPage implements OnInit, OnDestroy, AfterViewInit {
  page_title = '首页';
  segment = 'index';
  _userid: string;
  _user_bio: string;
  _notifyID = 0;
  _rest_notifyID = 10000;
  _task = {
    title: '',
  };
  voicePlaySrc = './assets/voice/voice.png';
  showWhiteNoiseIcon = false;
  whiteNoiseIsplaying = false;
  @ViewChild(Slides) slides: Slides;

  historyTomatoes: Array<any> = [];
  tomatoCount = 0;

  mp3Source: HTMLSourceElement = document.createElement('source');
  oggSource: HTMLSourceElement = document.createElement('source');
  alertAudio: HTMLAudioElement = document.createElement('audio');
  // 番茄钟长度
  countdown = 25;
  // 休息时间长度
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
  // 中断缘由
  breakReason: any;

  // 刷新时间圆圈
  UIRefreshIntervalID: any;

  @ViewChild(AngularRoundProgressDirective)
  child: AngularRoundProgressDirective;

  IsInTomatoTodaySlide = false;

  constructor(
    private app: App,
    public globalservice: GlobalService,
    public tomatoservice: OnlineTomatoService,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public tomatoIO: TomatoIOService,
    public alertCtrl: AlertController,
    public voiceService: VoicePlayService,
    private localNotifications: LocalNotifications
  ) {}

  ngOnInit() {
    // 加载今日番茄钟列表
    this.loadTomatoes();
    // 加载正在进行的番茄钟
    this._userid = this.globalservice.userinfo.username;
    this._user_bio = this.globalservice.userinfo.bio;
    this.countdown = this.globalservice.countdown;
    this.timerStatus.countdown = this.countdown;
    this.timerStatus.label = this.countdown + ':00';
    this.resttime = this.globalservice.resttime;
    this.globalservice.settingState.subscribe(settings => {
      // 不适用于开启番茄钟时进行设置
      this.countdown = settings.countdown;
      this.timerStatus.label = this.countdown + ':00';
      this.timerStatus.countdown = this.countdown;
      this.resttime = settings.resttime;
      this.refreshTimeUI();
      // setTimeout(this.stopRefreshTimeUI(), 1500);
    });

    this.tomatoIO.load_tomato(this._userid);
    this.tomatoIO.load_tomato_succeed().subscribe(t => {
      if (t && t !== 'null') {
        this.startTask(t, false);
      }
    });
    // 其它终端开启
    this.tomatoIO.other_end_start_tomato().subscribe(t => {
      if (t && t !== 'null') {
        this.startTask(t, false);
      }
    });
    // 其它终端中断
    this.tomatoIO.other_end_break_tomato().subscribe(data => {
      this.breakActiveTask(false);
    });
    // 服务端新增
    this.tomatoIO.new_tomate_added().subscribe(t => {
      if (t && t !== 'null') {
        this.historyTomatoes.unshift(t);
        this.tomatoCount += 1;
      } else {
        this.loadTomatoes();
      }
    });

    this.mp3Source.setAttribute('src', './assets/audios/alert.mp3');
    this.oggSource.setAttribute('src', './assets/audios/alert.ogg');
    this.alertAudio.appendChild(this.mp3Source);
    this.alertAudio.appendChild(this.oggSource);
    this.alertAudio.load();
  }

  doRefreshTodayTomato(refresher) {
    this.loadTomatoes(refresher);
  }

  loadTomatoes(refresher?) {
    this.tomatoservice.getTodayTomatos().subscribe(data => {
      // "{"status":"fail","description":"Token verify failed"}"
      if (refresher) {
         refresher.complete();
      }
      const list = JSON.parse(data._body);
      if (Array.isArray(list)) {
        this.historyTomatoes = list;
        this.tomatoCount = list.length;
      } else {
        // token 过期( TODO )
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

  ngOnDestroy() {}

  addTask() {
    const profileModal = this.modalCtrl.create('TaskPage');
    profileModal.onDidDismiss(data => {
      if (data.task) {
        console.log(data.task);
        this.startTask(data.task, true);
      }
    });
    profileModal.present();
  }

  slideChanged() {
    const currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
    switch (currentIndex) {
      case 0:
        this.page_title = '首页';
        this.IsInTomatoTodaySlide = false;
        break;
      case 1:
        this.page_title = '今日番茄钟(' + this.tomatoCount + ')';
        this.IsInTomatoTodaySlide = true;
        break;
      default:
        this.IsInTomatoTodaySlide = false;
        break;
    }
  }

  ngAfterViewInit() {
    this.refreshTimeUI();
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

  startTask(task: any, raw: Boolean) {
    this.activeTomato = task;
    this._task = JSON.parse(JSON.stringify(task));
    if (raw) {
      // 开启番茄钟
      this.tomatoIO.start_tomato(this._userid, task, this.countdown);
      this.activeTomato.startTime = new Date();
    } else {
      this.activeTomato.startTime = new Date(this.activeTomato.startTime);
    }
    this.startTimer();
    const that = this;
  }

  /**
   * 中断
   * @param isLocal 是否本地中断
   */
  breakActiveTask(isLocal) {
    if (isLocal) {
      this.showPrompt();
    } else {
      this.stopTimer();
      this.startRestTimer();
    }
  }

  /**
   * 中断番茄钟弹出框
   */
  showPrompt() {
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
            // 创建tomato
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
            this.historyTomatoes.push(Object.assign({}, tomato));
            this.tomatoCount += 1;
            this.tomatoIO.break_tomato(this._userid, tomatoDTO);
            this.stopTimer();
            this.startRestTimer();
          },
        },
      ],
    });
    prompt.present();
  }

  /**
   * 开启休息时钟
   */
  startRestTimer() {
    this.refreshTimeUI();
    this.resttimestart = new Date();
    if (typeof this.resttimeout !== 'undefined') {
      clearTimeout(this.resttimeout);
      this.timerStatus.reset();
    }
    this.isResting = true;
    this.resttimeout = setTimeout(this.onRestTimeout.bind(this), 1000);
    // 休息任务提醒
    this._rest_notifyID += 1;
    this.localNotifications.schedule({
      id: this._rest_notifyID,
      text: '休息完了，赶紧开启下一个番茄钟吧!',
      at: new Date(new Date().getTime() + 5 * 60 * 1000),
      sound: 'file://assets/audios/finish.wav',
      led: 'FF0000',
    });
  }

  /**
   * 开启番茄钟
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

    if (this._rest_notifyID > 10000) {
      this.localNotifications.cancel(this._rest_notifyID).then(() => {});
    }
    // 本地通知任务 cancel
    this._notifyID += 1;
    this.localNotifications.schedule({
      id: this._notifyID,
      title: this.activeTomato.title,
      text: '你又完成了一个番茄钟!',
      at: new Date(
        this.activeTomato.startTime.getTime() + this.countdown * 60 * 1000
      ),
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
    this.timerStatus.label = this.secondsToMMSS(
      this.countdown * 60 - parseInt(secondspan + '', 10)
    );
    // 倒计时结束
    if (dataspan >= this.countdown * 60 * 1000) {
      // this.alertAudio.play();
      this.startRestTimer();
      this.activeTomato = null;
      this.showWhiteNoiseIcon = false;
      this.stopPlayWhiteNoise();
      this.voiceService.play_local_voice('assets/audios/alert.mp3');
    } else {
      this.mytimeout = setTimeout(this.onTimeout.bind(this), 1000);
    }
  }

  onRestTimeout() {
    const datenow: number = new Date().getTime();
    const startTime: number = this.resttimestart.getTime();
    const dataspan: number = datenow - startTime;

    const secondspan: number = dataspan / 1000;
    const percentage = dataspan / (this.resttime * 60 * 1000);

    this.timerStatus.percentage = percentage;
    this.timerStatus.label = this.secondsToMMSS(
      this.resttime * 60 - parseInt(secondspan + '', 10)
    );

    if (dataspan >= this.resttime * 60 * 1000) {
      // this.alertAudio.play();
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
    if (this._notifyID > 0) {
      this.localNotifications.cancel(this._notifyID).then(() => {});
    }
    this.activeTomato = null;
    this.showWhiteNoiseIcon = false;
    this.stopPlayWhiteNoise();
    this.stopRefreshTimeUI();
  }

  secondsToMMSS(timeInSeconds: number) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds - minutes * 60;
    let retStr = '';
    if (minutes < 10) {
      retStr += '0' + minutes;
    } else {
      retStr += minutes;
    }
    retStr += ':';
    if (seconds < 10) {
      retStr += '0' + seconds;
    } else {
      retStr += seconds;
    }
    return retStr;
  }

  playVoiceRecord(tomato) {
    if (tomato.voiceUrl) {
      const fileNamePart = this.getFileName(tomato.voiceUrl);
      this.voiceService
        .downloadVoiceFile(fileNamePart, this.globalservice.token)
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

  getFileName(url) {
    const arr = url.split('/');
    const fileName = arr[arr.length - 1];
    return fileName;
  }

  stopPlayWhiteNoise() {
    this.whiteNoiseIsplaying = false;
    this.voiceService.stop_local_voice();
  }

  startPlayWhiteNoise() {
    this.whiteNoiseIsplaying = true;
    this.voiceService.play_local_voice('assets/audios/white_noise.mp3', true);
  }
}
