import { Component, OnInit } from '@angular/core';

import { GlobalService } from '@services/global.service';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Storage } from '@ionic/Storage';

@Component({
  selector: 'cmp-setting',
  templateUrl: 'setting.html',
  styleUrls: ['./setting.scss']
})
export class SettingPage implements OnInit {
  isAlwaysLight = false;

  longbreakTomatoNum: string;
  longresttime: string;
  IsLoopMode = false;
  whiteNoiseType: string;

  settingModel = {
    resttime: '5',
    countdown: '25',
    isAlwaysLight: true
  }

  constructor(
    public globalservice: GlobalService,
    private insomnia: Insomnia,
    public storage: Storage,
  ) { }

  ngOnInit() {
    this.settingModel.countdown = this.globalservice.countdown + '';
    this.settingModel.resttime = this.globalservice.resttime + '';
    this.settingModel.isAlwaysLight = this.globalservice.isAlwaysLight;
  }

  /**
   * 番茄钟时长
   * @param value 时长
   */
  setCountdown(value: string) {
    this.globalservice.countdown = parseInt(value,10);
  }

  /**
   * 短休息间隔
   * @param value 休息时长
   */
  setResttime(value: string) {
    this.globalservice.resttime = parseInt(value,10);
  }

  /**
   * 长休息间隔
   * @param value 休息时长
   */
  setLongResttime(value: string) {
    this.longresttime = value;
  }

  /**
   * 设置屏幕常亮状态
   */
  changeLightState() {
    if (this.isAlwaysLight) {
      this.globalservice.isAlwaysLight = true;
      this.insomnia.keepAwake().then(
        () => { },
        e => {
          this.globalservice.isAlwaysLight = false;
          console.log('error', e);
        }
      );
    } else {
      this.globalservice.isAlwaysLight = false;
      this.insomnia.allowSleepAgain().then(
        () => { },
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

  setLongbreakTomatoNum() { }

  setLoopMode() { }

  setWhiteNoiseType() { }
}
