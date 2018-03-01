/**
 * 音频播放服务
 */
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { GlobalService } from '../global.service';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Media, MediaObject, MEDIA_STATUS } from '@ionic-native/media';
import { Helper } from './helper';
import { resolve } from 'url';
import { reject } from 'q';
import { Observable } from 'rxjs/Observable';
import { observeOn } from 'rxjs/operator/observeOn';
declare var window;

@Injectable()
export class VoicePlayService {
  mediaRec: MediaObject;
  isPlaying = false;

  constructor(
    public platform: Platform,
    private media: Media,
    public _global: GlobalService,
    private helper: Helper,
    private transfer: FileTransfer,
    private file: File
  ) {}

  /**
   * 下载音频接口
   * @param filename
   * @param token
   */
  downloadVoiceFile(filename, token) {
    return new Promise((resolve, reject) => {
      const targetPath = this.helper.getBasePath() + 'voices/';
      const targetPathWithFileName =
        this.helper.getBasePath() + 'voices/' + filename;
      // 检查是否已下载过
      this.file.checkFile(targetPath, filename).then(
        success => {
          resolve(targetPathWithFileName);
        },
        error => {
          // 注意:此方法采用追加的方式添加
          const options = {
            headers: {
              Authorization: token
            }
          };
          const trustHosts = true;
          const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer
            .download(
              this._global.serverAddress + 'download/voicefile/' + filename,
              targetPathWithFileName,
              trustHosts,
              options
            )
            .then(result => {
              console.log('下载完成,播放..');
              resolve(targetPathWithFileName);
            })
            .catch(err => {
              console.log('下载音频文件出错', err);
              alert('下载音频文件出错');
              reject(err);
            });
          fileTransfer.onProgress((evt: ProgressEvent) => {
            const progress = window.parseInt(evt.loaded / evt.total * 100, 10);
            console.log(progress);
          });
        }
      );
    });
  }

  /**
   * 下载音频接口 observable 版本
   * @param filename
   * @param token
   */
  downloadVoiceFile_observable(filename, token) {
    return Observable.create(observer => {
      const targetPath = this.helper.getBasePath() + 'voices/';
      const targetPathWithFileName =
        this.helper.getBasePath() + 'voices/' + filename;
      // 检查是否已下载过
      this.file.checkFile(targetPath, filename).then(
        success => {
          // alert("已经下载,直接播放！");
          observer.next({
            data: true,
            value: targetPathWithFileName
          });
          observer.complete();
        },
        error => {
          // 注意:此方法采用追加的方式添加
          const options = {
            headers: {
              Authorization: token
            }
          };
          const trustHosts = true;
          const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer
            .download(
              this._global.serverAddress + 'download/voicefile/' + filename,
              targetPathWithFileName,
              trustHosts,
              options
            )
            .then(result => {
              console.log('下载完成,播放..');
              observer.next({
                data: true,
                value: targetPathWithFileName
              });
              observer.complete();
            })
            .catch(err => {
              alert('下载音频文件出错');
              console.log('下载音频文件出错', err);
              observer.error(err);
            });
          fileTransfer.onProgress((evt: ProgressEvent) => {
            const progress = window.parseInt(evt.loaded / evt.total * 100, 10);
            observer.next({
              data: false,
              value: progress
            });
            console.log(progress);
          });
        }
      );
    });
  }

  /**
   * 截取文件名
   * @param url
   */
  getFileName(url) {
    const arr = url.split('/');
    const fileName = arr[arr.length - 1];
    return fileName;
  }

  /**
   * 播放
   * @param voiFile 文件路径
   */
  play(voiFile) {
    return new Promise((resolve, reject) => {
      if (this.mediaRec) {
        this.mediaRec.stop();
        this.mediaRec.release();
      }
      if (!voiFile) {
        resolve(false);
        return;
      }
      if (this.platform.is('ios')) {
        voiFile = voiFile.replace('file://', '');
        voiFile = voiFile.replace('.aac', '.m4a');
      }
      this.mediaRec = this.media.create(voiFile);

      this.mediaRec.onSuccess.subscribe(() => {
        // 播放完成
        resolve(true);
        console.log('play():Audio Success');
      });
      this.mediaRec.onError.subscribe(error => {
        // 播放失败
        reject(error);
        console.log('play():Audio Error: ', error);
      });

      // 开始播放录音
      this.mediaRec.play();
    });
  }

  /**
   * 播放本地音频 www/ 内
   * @param file_url
   */
  play_local_voice(file_url, repeat?) {
    if (this.mediaRec) {
      this.mediaRec.stop();
      this.mediaRec.release();
    }
    function getPhoneGapPath() {
      let loc = window.location.pathname;
      loc = loc.substr(0, loc.length - 9);
      return 'file://' + loc;
    }
    let applicationDirectory = '';
    if (this.platform.is('android')) {
      applicationDirectory = getPhoneGapPath();
    }
    const path = applicationDirectory + file_url;
    this.mediaRec = this.media.create(path);

    this.mediaRec.onSuccess.subscribe(() => {
      console.log('play_local_voice():Audio Init Success');
    });
    this.mediaRec.onError.subscribe(error => {
      console.log('play_local_voice():Audio Error: ', error);
      this.isPlaying = false;
    });
    this.mediaRec.onStatusUpdate.subscribe(state => {
      // 循环播放
      if (this.isPlaying && repeat && state === MEDIA_STATUS.STOPPED) {
        console.log('play_local_voice():Audio Stoped: ', state);
        this.mediaRec.play();
        this.isPlaying = true;
      }
    });

    if (this.platform.is('ios')) {
      // 屏幕锁住仍然播放
      this.mediaRec.play({ playAudioWhenScreenIsLocked: true });
    } else {
      this.mediaRec.play();
    }
    this.isPlaying = true;
  }

  resume_local_voice() {
    if (this.mediaRec && !this.isPlaying) {
      this.isPlaying = true;
      this.mediaRec.play();
    }
  }

  pause_local_voice() {
    if (this.mediaRec && this.isPlaying) {
      this.isPlaying = false;
      this.mediaRec.pause();
    }
  }

  stop_local_voice() {
    if (this.mediaRec && this.isPlaying) {
      this.isPlaying = false;
      this.mediaRec.stop();
      this.mediaRec.release();
    }
  }
}
