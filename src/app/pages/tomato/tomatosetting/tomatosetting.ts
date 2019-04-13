import { Component, OnInit } from '@angular/core';

import { GlobalService } from '@services/global.service';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Storage } from '@ionic/Storage';

@Component({
  selector: 'cmp-tomatosetting',
  templateUrl: 'tomatosetting.html',
  styleUrls: ['./tomatosetting.scss']
})
export class TomatoSettingPage implements OnInit {

  longbreakTomatoNum: string;
  longresttime: string;
  IsLoopMode = false;
  whiteNoiseType: string;

  settingModel = {
    resttime: '5',
    countdown: '25',
  };

  constructor(
    public globalservice: GlobalService,
    private insomnia: Insomnia,
    public storage: Storage,
  ) { }

  ngOnInit() {
    this.settingModel.countdown = this.globalservice.countdown + '';
    this.settingModel.resttime = this.globalservice.resttime + '';
  }

  /**
   * 番茄钟时长
   * @param value 时长
   */
  setCountdown(value: string) {
    this.globalservice.countdown = parseInt(value, 10);
  }

  /**
   * 短休息间隔
   * @param value 休息时长
   */
  setResttime(value: string) {
    this.globalservice.resttime = parseInt(value, 10);
  }

  /**
   * 长休息间隔
   * @param value 休息时长
   */
  setLongResttime(value: string) {
    this.longresttime = value;
  }

  setLongbreakTomatoNum() { }

  setLoopMode() { }

  setWhiteNoiseType() { }
}
