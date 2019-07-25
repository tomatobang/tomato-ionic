import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OnlineFootprintService } from '@services/data.service';
import { BaiduLocationService } from '@services/baidulocation.service';
import { OnlineTagService } from '@services/data/tag/tag.service';
import { FootPrintService } from '../footprint.service';
declare var window;

@Component({
  selector: 'app-footprintform',
  templateUrl: './footprintform.component.html',
  styleUrls: ['./footprintform.component.scss'],
})
export class FootprintformComponent implements OnInit {
  title = '';
  location = '加载中...';
  create_at;
  notes = '';
  tag = ['补录'];
  voices = [];
  voicesToPlay = [];
  pictures = [];
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
  constructor(
    private onlinefootprintService: OnlineFootprintService,
    private tagservice: OnlineTagService,
    private modalCtrl: ModalController,
    private baidu: BaiduLocationService,
    private footprintService: FootPrintService
  ) { }

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
      this.location = '定位失败!';
      console.warn(err);
    });
    this.loadTags();
    this.create_at = new Date().toISOString();
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

  async submit() {
    if (this.location) {
      this.onlinefootprintService.createFootprint({
        position: this.location,
        notes: this.notes,
        tag: this.tag.join(','),
        mode: this.modeIndex + '',
        create_at: new Date(this.create_at).toISOString(),
        voices: this.voices,
        pictures: this.pictures
      }).subscribe(ret => {
        this.notes = '';
        ret.mode = new Array(parseInt(ret.mode, 10));
        this.clearTags();
        this.selectMode(3);
        this.voices = [];
        this.voicesToPlay = [];
        this.pictures = [];
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

  /**
 * 添加图片
 */
  addPictures() {
    this.footprintService.addPictures().subscribe(async ret => {
      if (ret && ret.data) {
        this.pictures.push(ret.value);
      } else if (ret && !ret.data) {

      }
    }, err => {
      console.warn(err);
    });
  }

  playLocalVoice(mediaSrc) {
    this.footprintService.playLocalVoice(mediaSrc);
  }

  addVoices(ret) {
    if (ret && ret.data) {
      const uploadMediaFilepath = ret.data.uploadMediaFilepath;
      const mediaSrc = ret.data.mediaSrc;
      const voiceDuration = ret.data.voiceDuration;

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
      this.footprintService.qiniuFileUpload(uploadMediaFilepath, fileName).then(() => {

      });
    }
  }
}
