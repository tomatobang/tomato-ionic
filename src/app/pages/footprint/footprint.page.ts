import { LoadingController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class FootprintPage implements OnInit, OnDestroy {
  location = '加载中...';
  create_at = '2012-12-12 10:00';
  notes = '';
  tag = [];
  footprintlist: any;
  mode = [
    { index: 1, selected: true },
    { index: 2, selected: true },
    { index: 3, selected: true },
    { index: 4, selected: false },
    { index: 5, selected: false },
  ];

  taglist = [
    {
      name: '起床', selected: false
    },
    {
      name: '睡觉', selected: false
    },
    {
      name: '上班', selected: false
    },
    {
      name: '下班', selected: false
    },
    {
      name: '吃饭', selected: false
    },
    {
      name: '开会', selected: false
    },
    {
      name: '活动', selected: false
    },
    {
      name: '出差', selected: false
    },
    {
      name: '旅游', selected: false
    },
  ];
  modeIndex = 3;
  openTag = false;
  timeInterval;

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

    this.refreshCreateAt();
    this.listFootprint();
  }

  ngOnDestroy() {
    clearInterval(this.timeInterval);
  }

  refreshCreateAt() {
    this.timeInterval = setInterval(() => {
      this.create_at = this.dateFtt("hh:mm:ss", new Date());
    }, 1000);
  }

  dateFtt(fmt, date) {
    var o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      "S": date.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
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
        tag: this.tag.join(','),
        mode: this.modeIndex + ''
      }).subscribe(ret => {
        this.notes = '';
        ret.mode = new Array(parseInt(ret.mode, 10));
        this.footprintlist.unshift(ret);
        this.clearTags();
        this.selectMode(3);
        loading.dismiss();
      });
    }
  }

  clearTags() {
    for (let index = 0; index < this.taglist.length; index++) {
      const element = this.taglist[index];
      if (element.selected === true) {
        element.selected = false;
      }
    }
    this.tag = [];
    this.openTag = false;
  }

  async createLoading() {
    const loading = await this.loading.create({
      spinner: 'bubbles',
      message: 'process...',
      translucent: true,
    });
    await loading.present();
    return loading;
  }


  /**
   * 删除足迹
   * @param _id 编号
   */
  async deleteFootprint(_id, index) {
    const loading = await this.createLoading();
    if (_id) {
      this.footprintserice.deleteFootprint(_id).subscribe(ret => {
        if (this.footprintlist && this.footprintlist.length > 0) {
          this.footprintlist.splice(index, 1);
        }
        loading.dismiss();
      });
    } else {
      loading.dismiss();
    }
  }

  openTagChooser() {
    this.openTag = !this.openTag;
  }

  selectTag(item) {
    item.selected = !item.selected;
    if (item.selected) {
      if (this.tag.indexOf(item.name) > -1) {
      } else {
        this.tag.push(item.name);
      }
    } else {
      if (this.tag.indexOf(item.name) > -1) {
        this.tag.splice(this.tag.indexOf(item.name), 1);
      }
    }
  }

}
