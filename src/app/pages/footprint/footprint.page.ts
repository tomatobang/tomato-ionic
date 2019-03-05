import { Component, OnInit } from '@angular/core';
import { BaiduLocationService } from '@services/baidulocation.service';

@Component({
  selector: 'app-footprint',
  templateUrl: './footprint.page.html',
  styleUrls: ['./footprint.page.scss'],
})
export class FootprintPage implements OnInit {
  location = '中国广东省深圳市xx区xxxx路';
  time = '2019-03-05 09:05:59';

  constructor(public baidu: BaiduLocationService) { }

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

}
