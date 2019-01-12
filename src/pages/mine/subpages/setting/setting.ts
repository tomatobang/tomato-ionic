import { Component, OnInit } from '@angular/core';

import { IonicPage } from 'ionic-angular';
import { GlobalService } from '@providers/global.service';
import { Insomnia } from '@ionic-native/insomnia';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'cmp-setting',
  templateUrl: 'setting.html',
})
export class SettingPage implements OnInit {
  resttime: number;
  countdown: number;
  isAlwaysLight = false;

  longbreakTomatoNum: number;
  longresttime: number;
  IsLoopMode = false;
  whiteNoiseType: string;
  constructor(
    public globalservice: GlobalService,
    private insomnia: Insomnia,
    public storage: Storage
  ) {}

  ngOnInit() {
    this.countdown = this.globalservice.countdown;
    this.resttime = this.globalservice.resttime;
    this.isAlwaysLight = this.globalservice.isAlwaysLight;
  }

  /**
   * 番茄钟时长
   * @param value 时长
   */
  setCountdown(value: number) {
    this.globalservice.countdown = value;
  }

  /**
   * 短休息间隔
   * @param value 休息时长
   */
  setResttime(value: number) {
    this.globalservice.resttime = value;
  }

  /**
   * 长休息间隔
   * @param value 休息时长
   */
  setLongResttime(value: number) {
    this.longresttime = value;
  }

  /**
   * 设置屏幕常亮状态
   */
  changeLightState() {
    if (this.isAlwaysLight) {
      this.globalservice.isAlwaysLight = true;
      this.insomnia.keepAwake().then(
        () => {},
        e => {
          this.globalservice.isAlwaysLight = false;
          console.log('error', e);
        }
      );
    } else {
      this.globalservice.isAlwaysLight = false;
      this.insomnia.allowSleepAgain().then(
        () => {},
        e => {
          this.globalservice.isAlwaysLight = true;
          console.log('error', e);
        }
      );
    }
  }

  /**
   * 清除消息记录
   */
  clearMsgCache() {
    this.storage.clear();
  }

  setLongbreakTomatoNum() {}

  setLoopMode() {}

  setWhiteNoiseType() {}
}
