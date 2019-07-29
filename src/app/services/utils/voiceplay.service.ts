/**
 * 音频播放服务
 */
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GlobalService } from '../global.service';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Media, MediaObject, MEDIA_STATUS } from '@ionic-native/media/ngx';
import { Helper } from './helper';
import { Observable } from 'rxjs';
declare var window;

@Injectable({
  providedIn: 'root',
})
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
  ) { }

  /**
   * 下载音频接口
   * @param filename
   * @param token
   */
  downloadVoiceFile(filename, remotepath) {
    return new Promise((resolve, reject) => {
      const targetPath = this.helper.getBasePath() + 'voices/';
      const targetPathWithFileName =
        this.helper.getBasePath() + 'voices/' + filename;
      this.file.checkFile(targetPath, filename).then(
        success => {
          resolve(targetPathWithFileName);
        },
        error => {
          const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer
            .download(remotepath, targetPathWithFileName)
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
            const progress = window.parseInt(
              (evt.loaded / evt.total) * 100,
              10
            );
            console.log(progress);
          });
        }
      );
    });
  }

  /**
   * 下载音频接口 observable 版本
   * @param filename
   * @param remotepath
   */
  downloadVoiceFile_observable(filename, remotepath): Observable<any> {
    return Observable.create(observer => {
      const targetPath = this.helper.getBasePath() + 'voices/';
      const targetPathWithFileName =
        this.helper.getBasePath() + 'voices/' + filename;
      // 检查是否已下载过
      this.file.checkFile(targetPath, filename).then(
        success => {
          observer.next({
            data: true,
            value: targetPathWithFileName,
          });
          observer.complete();
        },
        error => {
          const trustHosts = true;
          const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer
            .download(remotepath, targetPathWithFileName, trustHosts)
            .then(result => {
              console.log('下载完成,播放..');
              observer.next({
                data: true,
                value: targetPathWithFileName,
              });
              observer.complete();
            })
            .catch(err => {
              alert('下载音频文件出错');
              console.log('下载音频文件出错', err);
              observer.error(err);
            });
          fileTransfer.onProgress((evt: ProgressEvent) => {
            const progress = window.parseInt(
              (evt.loaded / evt.total) * 100,
              10
            );
            observer.next({
              data: false,
              value: progress,
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
        resolve(true);
        console.log('play():Audio Success');
      });
      this.mediaRec.onError.subscribe(error => {
        reject(error);
        console.log('play():Audio Error: ', error);
      });

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

    let applicationDirectory = '';
    if (this.platform.is('android')) {
      applicationDirectory = this.getPhoneGapPath();
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

  /**
   * android only
   */
  getPhoneGapPath() {
    return 'file:///android_asset/www/';
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
