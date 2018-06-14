import { Component, OnInit, ViewChild } from '@angular/core';

import { IonicPage } from 'ionic-angular';
import { GlobalService } from '@providers/global.service';
import { Insomnia } from '@ionic-native/insomnia';

declare var window;
@IonicPage()
@Component({
  selector: 'cmp-setting',
  templateUrl: 'setting.html'
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
    private insomnia: Insomnia
  ) {}

  ngOnInit() {
    this.countdown = this.globalservice.countdown;
    this.resttime = this.globalservice.resttime;
    this.isAlwaysLight = this.globalservice.isAlwaysLight;
  }

  setCountdown(value: number) {
    this.globalservice.countdown = value;
  }

  setResttime(value: number) {
    this.globalservice.resttime = value;
  }

  setLongResttime(value: number) {
    this.longresttime = value;
  }

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

  setLongbreakTomatoNum() {}

  setLoopMode() {}

  setWhiteNoiseType() {}
}
