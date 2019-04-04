import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OnlineFootprintService } from '@services/data.service';
import { BaiduLocationService } from '@services/baidulocation.service';

@Component({
  selector: 'app-footprintform',
  templateUrl: './footprintform.component.html',
  styleUrls: ['./footprintform.component.scss'],
})
export class FootprintformComponent implements OnInit {
  title = '';
  location = '加载中...';
  create_at = '2012-12-12 10:00';
  notes = '';
  tag = ['补录'];
  mode = [
    { index: 1, selected: true },
    { index: 2, selected: true },
    { index: 3, selected: true },
    { index: 4, selected: false },
    { index: 5, selected: false },
  ];

  locationList = [];

  taglist = [
    {
      name: '补录', selected: false
    },
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
    {
      name: '运动', selected: false
    },
    {
      name: '其它', selected: false
    },
  ];
  modeIndex = 3;
  openTag = false;
  constructor(
    private footprintserice: OnlineFootprintService,
    private modalCtrl: ModalController,
    private baidu: BaiduLocationService,
  ) {

  }

  ngOnInit() {
    this.baidu.getCurrentLocation().then(val => {
      if (val && val.time) {
        this.location = val.addr + '(' + val.locationDescribe + ')';
        if (val.pois) {
          this.locationList = val.pois;
        }
      } else {
        this.location = '网络问题，定位失败!';
      }
    }).catch(err => {
      console.warn(err);
    });
  }

  async submit() {
    if (this.location) {
      this.footprintserice.createFootprint({
        position: this.location,
        notes: this.notes,
        tag: this.tag.join(','),
        mode: this.modeIndex + ''
      }).subscribe(ret => {
        this.notes = '';
        ret.mode = new Array(parseInt(ret.mode, 10));
        this.clearTags();
        this.selectMode(3);
        this.modalCtrl.dismiss(ret);
      }, () => {
      });
    }
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

  openTagChooser() {
    this.openTag = !this.openTag;
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
