import { Component, OnInit } from '@angular/core';
import { BaiduLocationService } from '@services/baidulocation.service';
import { OnlineFootprintService } from '@services/data.service';

@Component({
  selector: 'app-footprint',
  templateUrl: './footprint.page.html',
  styleUrls: ['./footprint.page.scss'],
})
export class FootprintPage implements OnInit {
  location = '中国广东省深圳市xx区xxxx路';
  time = '2019-03-05 09:05:59';
  notes = '';

  constructor(
    private baidu: BaiduLocationService,
    private footprintserice: OnlineFootprintService
  ) { }

  ngOnInit() {
    this.baidu.getCurrentLocation().then(val => {
      if (val) {
        this.location = val.addr + '(' + val.locationDescribe + + ')';
        this.time = val.time;
      }
    }).catch(err => {
      console.error(err);
    });
  }

  // 今日足迹列表
  listFootprint() {
    this.footprintserice.getFootprints().subscribe(ret => {

    });
  }

  // 添加足迹
  addFootprint() {
    this.footprintserice.createFootprint({
      position: this.location,
      notes: this.notes
    }).subscribe(ret => {

    });
  }

}
