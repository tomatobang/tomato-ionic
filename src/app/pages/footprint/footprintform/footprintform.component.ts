import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Observable, concat } from 'rxjs';
import { VideoPlayer } from '@ionic-native/video-player/ngx';

import { OnlineFootprintService } from '@services/data.service';
import { BaiduLocationService } from '@services/baidulocation.service';
import { OnlineTagService } from '@services/data/tag/tag.service';
import { FootPrintService } from '../footprint.service';
import { Helper } from '@services/utils/helper';
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

  picturesSafeUrl = [];
  pictureObjs = [];
  videosObjs = [];
  voicesObjs = [];
  voicesQiniuUrl = [];
  picturesQiniuUrl = [];
  videosQiniuUrl = [];

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
    private footprintService: FootPrintService,
    private loading: LoadingController,
    private helper: Helper,
    private videoPlayer: VideoPlayer
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

  /**
 * 添加足迹
 */
  async addFootprint() {
    if (this.location) {
      const loading = await this.createLoading('努力上传中...');
      let arr: Observable<any>[] = [];
      for (let index = 0; index < this.pictureObjs.length; index++) {
        const element = this.pictureObjs[index];
        arr.push(this.footprintService.uploadPictures(element, loading, this.pictureObjs.length, index + 1));
      }

      for (let index = 0; index < this.videosObjs.length; index++) {
        const element = this.videosObjs[index];
        arr.push(this.footprintService.uploadVideos(element, loading, this.videosObjs.length, index + 1));
      }

      for (let index = 0; index < this.voicesObjs.length; index++) {
        const element = this.voicesObjs[index];
        arr.push(this.footprintService.uploadVoices(element, loading, this.voicesObjs.length, index + 1));
      }

      concat(...arr).subscribe(ret => {
        if (ret && ret.type) {
          switch (ret.type) {
            case 'picture':
              this.picturesQiniuUrl.push(ret.value);
              break;
            case 'video':
              this.videosQiniuUrl.push(ret.value);
              break;
            case 'voice':
              this.voicesQiniuUrl.push(ret.value);
              break;
            default:
              break;
          }
        }

      }, err => {
        console.log(err);
        if (loading) {
          loading.dismiss();
        }
      }, () => {
        this.createRecord(loading);
      });
    }
  }

  createRecord(loading) {
    if (this.location) {
      this.onlinefootprintService.createFootprint({
        position: this.location,
        notes: this.notes,
        tag: this.tag.join(','),
        mode: this.modeIndex + '',
        create_at: new Date(this.create_at).toISOString(),
        voices: this.voicesQiniuUrl,
        pictures: this.picturesQiniuUrl,
        videos: this.videosQiniuUrl
      }).subscribe(ret => {
        loading.dismiss();
        ret.mode = new Array(parseInt(ret.mode, 10));
        this.notes = '';
        this.voicesQiniuUrl = [];
        this.voicesObjs = [];
        this.pictureObjs = [];
        this.picturesSafeUrl = [];
        this.picturesQiniuUrl = [];
        this.videosQiniuUrl = [];
        this.videosObjs = [];
        this.clearTags();
        this.selectMode(3);
        this.modalCtrl.dismiss(ret);
      }, () => {
        loading.dismiss();
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
    this.footprintService.addPictures().subscribe(LOCAL_FILE_URI => {
      if (LOCAL_FILE_URI) {
        this.picturesSafeUrl.push(this.helper.dealWithLocalUrl(LOCAL_FILE_URI));
        this.pictureObjs.push(LOCAL_FILE_URI);
      }
    }, err => {
      console.warn(err);
    });
  }

  /**
 * 录制视频
 */
  async addVideo() {
    let loading;
    loading = await this.createLoading('视频制作中');
    this.footprintService.addVideo().subscribe(ret => {
      if (ret) {
        let { videoUrl, thumbImg } = ret;
        console.log(ret);
        if (thumbImg) {
          this.videosObjs.push({
            safeUrl: this.helper.dealWithLocalUrl('file://' + thumbImg),
            thumbnailRawUrl: thumbImg,
            videoUrl: 'file://' + videoUrl
          });
        }
        loading.dismiss();
      } else if (ret && !ret.data) {
        const downloadProgress = window.parseInt(
          ret.value * 100,
          10
        );
        loading.message = `<div>已完成${downloadProgress}%</div>`;
      }
    }, err => {
      loading.dismiss();
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

      this.voicesObjs.push({
        uploadMediaFilepath: uploadMediaFilepath,
        mediaSrc: mediaSrc,
        voiceDuration: voiceDuration
      });
    }
  }

  /**
     * 播放本地视频
     * @param url 
     */
  showVideo(url) {
    this.videoPlayer.play(url).then(() => {
      console.log('video completed');
    }).catch(err => {
      console.log(err);
    });
  }

  async createLoading(msg?) {
    const loading = await this.loading.create({
      spinner: 'bubbles',
      message: msg ? msg : 'process...',
      translucent: true,
    });
    await loading.present();
    return loading;
  }
}
