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
  settingModel = {
    isAlwaysLight: false,
    isAllowEditPicture: true
  };

  constructor(
    private globalservice: GlobalService,
    private insomnia: Insomnia,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.settingModel.isAlwaysLight = this.globalservice.isAlwaysLight;
    this.settingModel.isAllowEditPicture = this.globalservice.isAllowEditPicture;
  }

  /**
   * 设置屏幕常亮状态
   */
  changeLightState() {
    if (this.settingModel.isAlwaysLight) {
      this.insomnia.keepAwake().then(
        () => {
          this.globalservice.isAlwaysLight = true;
        },
        e => {
          console.log('error', e);
        }
      );
    } else {
      this.insomnia.allowSleepAgain().then(
        () => {
          this.globalservice.isAlwaysLight = false;
        },
        e => {
          console.log('error', e);
        }
      );
    }
  }

  /**
 * 设置足迹照片是否允许编辑
 */
  allowEditPicture() {
    if (this.settingModel.isAllowEditPicture) {
      this.globalservice.isAllowEditPicture = true;
    } else {
      this.globalservice.isAllowEditPicture = false;
    }
  }

  /**
   * 清除消息记录
   */
  clearMsgCache() {
    this.storage.clear();
  }

}
