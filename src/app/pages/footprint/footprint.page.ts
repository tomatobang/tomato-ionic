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
  location = '';
  create_at = '';
  notes = '';
  tag = '';
  footprintlist: Footprint[]

  constructor(
    private baidu: BaiduLocationService,
    private footprintserice: OnlineFootprintService,
    private globalservice: GlobalService,
    private rebirthProvider: RebirthHttpProvider,
    private loading: LoadingController
  ) {
    this.rebirthProvider.headers({ Authorization: this.globalservice.token }, true);
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
      }
      loading.dismiss();
    });
  }

  /**
   * 添加足迹
   */
  async addFootprint() {
    const loading = await this.createLoading();
    if (this.location) {
      this.footprintserice.createFootprint({
        position: this.location,
        notes: this.notes
      }).subscribe(ret => {
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
    this.tag = tag.join(':') + this.notes;
  }

}
