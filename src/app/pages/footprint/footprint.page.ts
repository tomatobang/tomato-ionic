
import { LoadingController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { VideoPlayer } from '@ionic-native/video-player/ngx';

import { GlobalService } from '@services/global.service';
import { BaiduLocationService } from '@services/baidulocation.service';
import { OnlineFootprintService } from '@services/data.service';
import { EmitService } from '@services/emit.service';
import { OnlineTagService } from '@services/data/tag/tag.service';

import { FootprintformComponent } from './footprintform/footprintform.component';
import { FootPrintService } from './footprint.service';
import { Helper } from '@services/utils/helper';
declare var window;

@Component({
  selector: 'app-footprint',
  templateUrl: './footprint.page.html',
  styleUrls: ['./footprint.page.scss'],
})
export class FootprintPage implements OnInit, OnDestroy {

  location = '加载中...';
  createAt = '2012-12-12 10:00';
  notes = '';
  tag = [];
  voices = [];
  voicesToPlay = [];
  pictures_safeUrl = [];
  pictures = [];
  pictures_qiniu = [];
  videos_qiniu = [];
  videosObj = [];
  // TODO: 是否公开
  isPublish = false;
  // 是否显示输入面板
  showInput = false;

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
    private globalservice: GlobalService,
    private footprintservice: OnlineFootprintService,
    private tagservice: OnlineTagService,
    private loading: LoadingController,
    private emitService: EmitService,
    private modalCtrl: ModalController,
    private footprintService: FootPrintService,
    private helper: Helper,
    private videoPlayer: VideoPlayer
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
      this.loadTags();
      this.listFootprint();
    });
  }

  ngOnDestroy() {
    clearInterval(this.timeInterval);
  }

  refreshCreateAt() {
    this.timeInterval = setInterval(() => {
      this.createAt = this.dateFtt('hh:mm:ss', new Date());
    }, 1000);
  }

  doRefresh(event) {
    this.locating(event);
    this.listFootprint();
  }

  locating(event?) {
    this.baidu.getCurrentLocation().then(val => {
      if (val && val.time) {
        this.createAt = this.dateFtt('hh:mm:ss', new Date(val.time));
        this.location = val.addr + '(' + val.locationDescribe + ')';
        if (val.pois) {
          this.locationList = val.pois;
        }
        if (event) {
          event.target.complete();
        }
      } else {
        this.createAt = this.dateFtt('hh:mm:ss', new Date());
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
      if (this.tag.indexOf(item.name) > -1) {
        this.tag.splice(this.tag.indexOf(item.name), 1);
      }
    });
  }

  showAndHideDeleteBut(item) {
    item.showDeleteBut = !item.showDeleteBut;
  }

  deletePicture(item, i) {
    this.pictures_safeUrl.splice(i, 1);
    this.pictures.splice(i, 1);
  }

  deleteVideo(item, i) {
    this.videosObj.splice(i, 1);
  }

  /**
   * 今日足迹
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
      const loading = await this.createLoading('努力上传中...');
      this.uploadPictures(loading, this.pictures.length).subscribe(ret => {
        if (ret) {
          this.uploadVideos(loading, this.videosObj.length).subscribe(ret => {
            if (ret) {
              this.createRecord(loading);
            }
          });
        }
      });
    }

  }

  uploadPictures(loading, total) {
    return Observable.create(async observer => {
      if (this.pictures.length > 0) {
        const local_url = this.pictures.splice(0, 1)[0];
        const remoteFileName = 'footprint_img_' + this.globalservice.userinfo.username +
          '_' +
          new Date().valueOf();
        console.log('准备上传:', local_url);
        this.footprintService.qiniuFileUpload(local_url, remoteFileName).subscribe(ret => {
          if (ret && ret.data) {
            console.log('上传成功:', local_url);
            this.pictures_qiniu.push(ret.value);
            if (this.pictures.length > 0) {
              this.uploadPictures(loading, total);
            } else {
              observer.next(true);
              observer.complete();
            }
          } else if (ret && !ret.data) {
            const downloadProgress = window.parseInt(
              ret.value * 100,
              10
            );
            loading.message = `<div>图片(${total - this.pictures.length}/${total})已完成${downloadProgress}%</div>`;
          }

        }, async err => {
          console.error(err);
          loading.dismiss();
          this.helper.createToast('上传失败，请重试!');
        });
      } else {
        observer.next(true);
        observer.complete();
      }
    });

  }

  uploadVideos(loading, total) {
    return Observable.create(async observer => {
      if (this.videosObj.length > 0) {
        const videoObj = this.videosObj.splice(0, 1)[0];
        console.log('准备上传视频:', videoObj.videoUrl);
        const remoteFileName = 'footprint_video_' + this.globalservice.userinfo.username +
          '_' +
          new Date().valueOf();
        // 上传视频
        this.footprintService.qiniuFileUpload(videoObj.videoUrl, remoteFileName).subscribe(ret => {
          if (ret && ret.data) {
            console.log('视频上传成功:', ret.value);
            this.videos_qiniu.push(ret.value);
            // 上传缩略图
            this.footprintService.qiniuFileUpload(videoObj.thumbnailRawUrl, remoteFileName + '_thumbnail').subscribe(ret => {
              if (ret && ret.data) {
                console.log('视频缩略图上传成功:', ret.data);
                if (this.videosObj.length > 0) {
                  this.uploadVideos(loading, total);
                } else {
                  observer.next(true);
                  observer.complete();
                }
              }
            });

          } else if (ret && !ret.data) {
            const downloadProgress = window.parseInt(
              ret.value * 100,
              10
            );
            loading.message = `<div>视频(${total - this.videosObj.length}/${total})已完成${downloadProgress}%</div>`;
          }

        }, async err => {
          console.error(err);
          loading.dismiss();
          this.helper.createToast('上传视频失败，请重试!');
        });
      } else {
        observer.next(true);
        observer.complete();
      }
    });

  }

  createRecord(loading) {
    if (this.location) {
      this.footprintservice.createFootprint({
        position: this.location,
        notes: this.notes,
        tag: this.tag.join(','),
        mode: this.modeIndex + '',
        voices: this.voices,
        pictures: this.pictures_qiniu,
        videos: this.videos_qiniu
      }).subscribe(ret => {
        loading.dismiss();
        ret.mode = new Array(parseInt(ret.mode, 10));
        this.footprintlist.unshift(ret);
        this.notes = '';
        this.voices = [];
        this.voicesToPlay = [];
        this.pictures = [];
        this.pictures_safeUrl = [];
        this.pictures_qiniu = [];
        this.videos_qiniu = [];
        this.videosObj = [];
        this.clearTags();
        this.selectMode(3);
        this.showInput = false;
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

  async createLoading(msg?) {
    const loading = await this.loading.create({
      spinner: 'bubbles',
      message: msg ? msg : 'process...',
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
    this.footprintService.addPictures().subscribe(LOCAL_FILE_URI => {
      if (LOCAL_FILE_URI) {
        this.pictures_safeUrl.push(this.helper.dealWithLocalUrl(LOCAL_FILE_URI));
        this.pictures.push(LOCAL_FILE_URI);
      }
    }, err => {
      console.warn(err);
    });
  }

  async addVideo() {
    let loading;
    loading = await this.createLoading('视频制作中');
    this.footprintService.addVideo().subscribe(ret => {
      if (ret) {
        let { videoUrl, thumbImg } = ret;
        console.log(ret);
        if (thumbImg) {
          this.videosObj.push({
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

  showVideo(url) {
    this.videoPlayer.play(url).then(() => {
      console.log('video completed');
    }).catch(err => {
      console.log(err);
    });
  }

  dateFtt(fmt, date) {
    const o = {
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
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt;
  }

  showInputContainer() {
    this.showInput = !this.showInput;
  }

}
