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
  location = 'dsadasfefefefefefe';
  create_at = '';
  notes = '';
  tag = '';
  footprintlist: Footprint[]

  constructor(
    private baidu: BaiduLocationService,
    private footprintserice: OnlineFootprintService,
    private globalservice: GlobalService,
    private rebirthProvider: RebirthHttpProvider,
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

  /**
   * 今日足迹列表
   */
  listFootprint() {
    this.footprintserice.getFootprints().subscribe(ret => {
      if (ret) {
        this.footprintlist = ret;
      }
    });
  }

  /**
   * 添加足迹
   */
  addFootprint() {
    if (this.location) {
      this.footprintserice.createFootprint({
        position: this.location,
        notes: this.notes
      }).subscribe(ret => {
        this.footprintlist.unshift(ret);
      });
    }
  }

  /**
   * 删除足迹
   * @param _id 编号
   */
  deleteFootprint(_id) {
    if (_id) {
      this.footprintserice.deleteFootprint(_id).subscribe(ret => {
        this.listFootprint();
      });
    }
  }

  tagChange(e) {
    let tag = e.detail.value;
    this.tag = tag.join(':') + this.notes;
  }

}
