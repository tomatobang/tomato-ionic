import { LoadingController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { BaiduLocationService } from '@services/baidulocation.service';
import { OnlineFootprintService } from '@services/data.service';
import { EmitService } from '@services/emit.service';
import { GlobalService } from '@services/global.service';
import { OnlineTagService } from '@services/data/tag/tag.service';

import { FootprintformComponent } from './footprintform/footprintform.component';
import { ShowBigImgsModal } from '@modals/show-big-imgs/show-big-imgs';

import { FootPrintService } from './footprint.service';

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
  voices = [];
  voicesToPlay = [];
  pictures = [];
  isPublish = false;

  footprintlist: any;
  mode = [
    { index: 1, selected: true },
    { index: 2, selected: true },
    { index: 3, selected: true },
    { index: 4, selected: false },
    { index: 5, selected: false },
  ];

  locationList = [];

  taglist = [];
  modeIndex = 3;
  openTag = false;
  timeInterval;

  constructor(
    private baidu: BaiduLocationService,
    private footprintservice: OnlineFootprintService,
    private tagservice: OnlineTagService,
    private loading: LoadingController,
    private emitService: EmitService,
    private modalCtrl: ModalController,
    private footprintService: FootPrintService,
    private globalservice: GlobalService,

  ) {
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
    this.locating();
    this.refreshCreateAt();
    this.listFootprint();
    this.loadTags();
    this.emitService.getActiveUser().subscribe(ret => {
      this.listFootprint();
    });
  }

  ngOnDestroy() {
    clearInterval(this.timeInterval);
  }

  refreshCreateAt() {
    this.timeInterval = setInterval(() => {
      this.create_at = this.dateFtt('hh:mm:ss', new Date());
    }, 1000);
  }

  doRefresh(event) {
    this.locating(event);
    this.listFootprint();
  }

  locating(event?) {
    this.baidu.getCurrentLocation().then(val => {
      if (val && val.time) {
        this.create_at = this.dateFtt('hh:mm:ss', new Date(val.time));
        this.location = val.addr + '(' + val.locationDescribe + ')';
        if (val.pois) {
          this.locationList = val.pois;
        }
        if (event) {
          event.target.complete();
        }
      } else {
        this.create_at = this.dateFtt('hh:mm:ss', new Date());
        this.location = '网络问题，定位失败!';
        if (event) {
          event.target.complete();
        }
      }
    }).catch(err => {
      this.location = '定位失败!';
      if (event) {
        event.target.complete();
      }
      console.warn(err);
    });
  }

  async loadTags() {
    this.tagservice.getTags(1).subscribe(ret => {
      if (ret && ret.length > 0) {
        let tags;
        tags = [];
        ret.map(val => {
          tags.push({
            _id: val._id, name: val.name, selected: false, showDeleteBut: false
          });
        });
        this.taglist = tags;
      }
    });
  }

  addTag(name) {
    if (name && name.length >= 1) {
      this.tagservice.createTag({
        type: 1,
        name: name
      }).subscribe(res => {
        if (res) {
          this.taglist.push({
            _id: res._id, name: name, selected: false, showDeleteBut: false
          });
        }
      });
    }
  }

  deleteTag(item, i) {
    this.tagservice.deleteTag(item._id).subscribe(res => {
      this.taglist.splice(i, 1);
    });
  }

  showAndHideDeleteBut(item) {
    item.showDeleteBut = !item.showDeleteBut;
  }

  /**
   * 今日足迹列表
   */
  async listFootprint() {
    const loading = await this.createLoading();
    this.footprintservice.getFootprints().subscribe(ret => {
      loading.dismiss();
      if (ret) {
        this.footprintlist = ret;
        this.footprintlist.sort(function (a, b) {

          return new Date(a.create_at) < new Date(b.create_at) ? 1 : -1;
        });
        this.footprintlist.map(val => {
          val.mode = new Array(parseInt(val.mode, 10));
        });
      }
    }, () => {
      loading.dismiss();
    });
  }

  /**
   * 添加足迹
   */
  async addFootprint() {
    if (this.location) {
      const loading = await this.createLoading();
      this.footprintservice.createFootprint({
        position: this.location,
        notes: this.notes,
        tag: this.tag.join(','),
        mode: this.modeIndex + '',
        voices: this.voices,
        pictures: this.pictures
      }).subscribe(ret => {
        loading.dismiss();
        ret.mode = new Array(parseInt(ret.mode, 10));
        this.footprintlist.unshift(ret);
        this.notes = '';
        this.voices = [];
        this.voicesToPlay = [];
        this.pictures = [];
        this.clearTags();
        this.selectMode(3);
      }, () => {
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
      this.footprintservice.deleteFootprint(_id).subscribe(ret => {
        loading.dismiss();
        if (this.footprintlist && this.footprintlist.length > 0) {
          this.footprintlist.splice(index, 1);
        }
      }, () => {
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

  async toFootprintForm() {
    const modal = await this.modalCtrl.create({
      component: FootprintformComponent,
      componentProps: {
        edit: false
      }
    });
    modal.onDidDismiss().then(ret => {
      const data = ret.data;
      if (data) {
        this.footprintlist.unshift(data);
      }
    });
    await modal.present();
  }

  addVoices(ret) {
    if (ret && ret.data) {
      let uploadMediaFilepath = ret.data.uploadMediaFilepath;
      let mediaSrc = ret.data.mediaSrc;
      let voiceDuration = ret.data.voiceDuration;

      this.voicesToPlay.push({
        uploadMediaFilepath: uploadMediaFilepath,
        mediaSrc: mediaSrc,
        voiceDuration: voiceDuration
      });

      let fileName = uploadMediaFilepath.substr(
        uploadMediaFilepath.lastIndexOf('/') + 1
      );
      fileName = 'footprint_voice_' + fileName;
      this.voices.push(fileName);
      this.footprintService.uploadVoiceFile(uploadMediaFilepath, fileName).then(() => {

      });
    }
  }

  playLocalVoice(mediaSrc) {
    this.footprintService.playLocalVoice(mediaSrc);
  }

  /**
   * 添加图片
   */
  addPictures() {
    this.footprintService.addPictures().subscribe(ret => {
      if (ret) {
        this.pictures.push(ret);
      }
    });
  }

  async showBigImgs(pictures) {
    const modal = await this.modalCtrl.create({
      component: ShowBigImgsModal,
      componentProps: {
        pictures: pictures
      }
    });
    modal.onDidDismiss().then(ret => {
    });
    await modal.present();
  }

  dateFtt(fmt, date) {
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt;
  }

}
