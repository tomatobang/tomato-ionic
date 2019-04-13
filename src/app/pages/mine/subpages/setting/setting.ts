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

  settingModel = {
    isAlwaysLight: true
  };

  constructor(
    public globalservice: GlobalService,
    private insomnia: Insomnia,
    public storage: Storage,
  ) { }

  ngOnInit() {
    this.settingModel.isAlwaysLight = this.globalservice.isAlwaysLight;
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

}
