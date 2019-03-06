import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { BaiduLocationService } from '@services/baidulocation.service';
import { OnlineFootprintService } from '@services/data.service';
import { Footprint } from '@services/data/footprint/model/footprint.model';
import { RebirthHttpProvider } from 'rebirth-http';
import { GlobalService } from '@services/global.service';

@Component({
  selector: 'app-footprint',
  templateUrl: './footprint.page.html',
  styleUrls: ['./footprint.page.scss'],
})
export class FootprintPage implements OnInit {
  location = '加载中...';
  create_at = '2012-12-12 10:00';
  notes = '';
  tag = '';
  footprintlist: any;
  mode = [
    { index: 1, selected: true },
    { index: 2, selected: true },
    { index: 3, selected: true },
    { index: 4, selected: false },
    { index: 5, selected: false },
  ];
  modeIndex = 3;

  constructor(
    private baidu: BaiduLocationService,
    private footprintserice: OnlineFootprintService,
    private globalservice: GlobalService,
    private rebirthProvider: RebirthHttpProvider,
    private loading: LoadingController
  ) {
    this.rebirthProvider.headers({ Authorization: this.globalservice.token }, true);
  }

  selectMode(index) {
    this.modeIndex = index;
    for (let i = 0; i < index; i++) {
      const element = this.mode[i];
      element.selected = true;
    }
    for (let j = index; j < this.mode.length; j++) {
      const element = this.mode[j];
      element.selected = false;
    }
  }

  ngOnInit() {
    this.baidu.getCurrentLocation().then(val => {
      if (val) {
        this.location = val.addr + '(' + val.locationDescribe + ')';
        this.create_at = val.time;
      }
    }).catch(err => {
      console.error(err);
    });

    this.listFootprint();
  }

  doRefresh(event) {
    this.baidu.getCurrentLocation().then(val => {
      if (val) {
        this.location = val.addr + '(' + val.locationDescribe + ')';
        this.create_at = val.time;
      }
      event.target.complete();
    }).catch(err => {
      event.target.complete();
      console.error(err);
    });
  }

  /**
   * 今日足迹列表
   */
  async listFootprint() {
    const loading = await this.createLoading();
    this.footprintserice.getFootprints().subscribe(ret => {
      if (ret) {

        this.footprintlist = ret;
        this.footprintlist.sort(function (a, b) {

          return new Date(a.create_at) < new Date(b.create_at) ? 1 : -1;
        });
        this.footprintlist.map(val => {
          val.mode = new Array(parseInt(val.mode, 10));
        });
      }
      loading.dismiss();
    });
  }

  /**
   * 添加足迹
   */
  async addFootprint() {
    if (this.location) {
      const loading = await this.createLoading();
      this.footprintserice.createFootprint({
        position: this.location,
        notes: this.notes,
        tag: this.tag,
        mode: this.modeIndex + ''
      }).subscribe(ret => {
        ret.mode = new Array(parseInt(ret.mode, 10));
        this.footprintlist.unshift(ret);
        loading.dismiss();
      });
    }
  }

  async createLoading() {
    const loading = await this.loading.create({
      spinner: 'bubbles',
      message: '提交中...',
      translucent: true,
    });
    await loading.present();
    return loading;
  }


  /**
   * 删除足迹
   * @param _id 编号
   */
  async deleteFootprint(_id) {
    const loading = await this.createLoading();
    if (_id) {
      this.footprintserice.deleteFootprint(_id).subscribe(ret => {
        this.listFootprint();
        loading.dismiss();
      });
    }
  }

  tagChange(e) {
    let tag = e.detail.value;
    this.tag = tag.join(':');
  }

}
