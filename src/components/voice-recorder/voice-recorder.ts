/**
 * 这块涉及到业务，算不上纯组件
 */

import {
  Component,
  forwardRef,
  ElementRef,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Platform } from 'ionic-angular';
import { Gesture } from 'ionic-angular/gestures/gesture';
import { Media, MediaObject } from '@ionic-native/media';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from '@ionic-native/file-transfer';

declare let window;

@Component({
  selector: 'voice-recorder',
  providers: [Media, FileTransfer], // ,File
  templateUrl: './voice-recorder.html',
})
export class VoiceRecorderComponent implements OnInit, OnDestroy {
  couldPlay = false;
  temp_file_path: string;

  _postParams: any;
  uploadUrl: string;
  isUploading = false;
  uploadProgress = 0;

  el: HTMLElement;
  pressGesture: Gesture;
  isStartRecord = false;
  recordWait = false;
  isStartedVoice = false;
  mediaRec: MediaObject;
  src = '';
  path = '';
  voice = {
    ImgUrl: './assets/voice/recog000.png',
    reset() {
      this.ImgUrl = './assets/voice/recog000.png';
    },
  };

  @Input()
  get voiceUploadUrl(): any {
    return this.uploadUrl;
  }
  set voiceUploadUrl(val) {
    this.uploadUrl = val.url;
  }

  @Input()
  get postParams(): any {
    return this._postParams;
  }
  set postParams(val) {
    this._postParams = val;
  }

  constructor(
    private media: Media,
    public platform: Platform,
    private elRef: ElementRef,
    private transfer: FileTransfer
  ) {
    if (this.platform.is('ios')) {
      this.path = window.cordova ? window.cordova.file.documentsDirectory : '';
      this.src = 'cordovaIMVoice.m4a';
    } else {
      this.path = window.cordova
        ? window.cordova.file.externalApplicationStorageDirectory
        : '';
      this.src = 'cordovaIMVoice.mp3';
    }
    this.el = elRef.nativeElement;
  }

  ngOnInit() {
    this.pressGesture = new Gesture(this.el, { time: 200 });
    this.pressGesture.listen();
    // 长按录音
    this.pressGesture.on('press', e => {
      console.log('press开始了');
      this.onHold();
    });
    this.el.onpointerleave = () => {
      console.log('onpointerleave');
      this.onRecordEnd();
    };

    this.el.ontouchend = () => {
      console.log('ontouchend');
      this.onRecordEnd();
    };
    this.el.ontouchcancel = () => {
      console.log('ontouchcancel');
      this.onRecordEnd();
    };
  }

  onRecordEnd() {
    this.recordWait = true;
    this.voice.reset();
    this.onRelease();
  }

  ngOnDestroy() {
    this.pressGesture.destroy();
  }

  onHold() {
    this.isStartRecord = true;
    this.recordWait = false;
    try {
      // 实例化录音类
      this.startRec();
      // 开始录音
      this.mediaRec.startRecord();
      // 已经开始
      this.isStartedVoice = true;
      return false;
    } catch (err) {
      console.log(err);
    }
  }

  startRec() {
    try {
      if (this.mediaRec) {
        this.mediaRec.release();
      }
      // 模拟声音大小变化
      const voicechange = setInterval(() => {
        if (!this.recordWait) {
          const i = Math.round(Math.random() * 9);
          this.voice.ImgUrl = 'assets/voice/recog00' + i + '.png';
        } else {
          clearInterval(voicechange);
        }
      }, 400);
      // 实例化录音类
      this.mediaRec = this.media.create(this.getNewMediaURL(this.src));
      this.mediaRec.onStatusUpdate.subscribe(status => console.log(status));
      this.mediaRec.onSuccess.subscribe(() =>
        console.log('audio is successful')
      );
      this.mediaRec.onError.subscribe(error => console.log('Error!', error));
    } catch (err) {
      console.log(err);
    }
  }

  onRelease() {
    try {
      // 如果没有开始直接返回
      if (!this.isStartedVoice) {
        return;
      }
      // 还原标识
      this.isStartedVoice = false;
      this.recordWait = true;
      setTimeout(() => {
        this.isStartRecord = false;
      }, 1000);
      if (this.mediaRec) {
        this.mediaRec.stopRecord();
        this.mediaRec.release();
      }
      // 实例化录音类, src:需要播放的录音的路径
      this.mediaRec = this.media.create(this.getMediaURL(this.src));
      // 录音执行函数
      this.mediaRec.onSuccess.subscribe(() =>
        console.log('touchend():Audio Success')
      );
      // 录音失败执行函数
      this.mediaRec.onError.subscribe(error =>
        console.log('touchend():Audio Error!', error)
      );
      this.mediaRec.play();
      this.mediaRec.stop();

      // 在html中显示当前状态
      let counter = 0;
      const timerDur = setInterval(() => {
        counter = counter + 100;
        if (counter > 2000) {
          clearInterval(timerDur);
        }
        const dur = this.mediaRec.getDuration();
        if (dur > 0) {
          clearInterval(timerDur);
          let tmpPath = this.getMediaURL(this.src);
          if (this.platform.is('ios')) {
            tmpPath = this.path + this.src;
          }
          this.temp_file_path = tmpPath.replace('file://', '');
          this.couldPlay = true;
          if (this.mediaRec) {
            this.mediaRec.release();
          }
        }
      }, 100);
      return false;
    } catch (e) {
      console.log(e);
    }
  }

  play(voiFile) {
    if (this.mediaRec) {
      this.mediaRec.stop();
      this.mediaRec.release();
    }
    if (!voiFile) {
      voiFile = this.getNewMediaURL(this.src);
    }
    if (this.platform.is('ios')) {
      voiFile = voiFile.replace('file://', '');
    }
    this.mediaRec = this.media.create(voiFile);

    this.mediaRec.onSuccess.subscribe(() => {
      // 播放完成
      console.log('play():Audio Success');
    });
    this.mediaRec.onError.subscribe(error => {
      // 播放失败
      console.log('play():Audio Error: ', error);
    });

    // 开始播放录音
    this.mediaRec.play();
    return false;
  }

  getNewMediaURL(s) {
    if (this.platform.is('android')) {
      return this.path + s;
    }
    return 'documents://' + s;
  }

  getMediaURL(s) {
    if (this.platform.is('android')) {
      return this.path + s;
    }
    return (this.path + s).replace('file://', '');
  }

  /**
   * 上传音频文件
   */
  uploadVoiceFile(token) {
    return new Promise((resolve, reject) => {
      this.isUploading = true;
      if (!this.temp_file_path) {
        reject('没有录音!');
      }

      const tmpPath = this.temp_file_path;
      if (!this.uploadUrl) {
        reject('uploadUrl 不存在');
        return;
      } else {
        const fileTransfer: FileTransferObject = this.transfer.create();
        if (!this._postParams) {
          reject('_postParams 不存在');
          return;
        }

        const options: FileUploadOptions = {
          httpMethod: 'post',
          fileKey: 'file',
          fileName: tmpPath.substr(tmpPath.lastIndexOf('/') + 1),
          mimeType: 'text/plain',
          headers: {
            Authorization: token,
          },
          params: this._postParams,
        };
        console.log(tmpPath, this.uploadUrl, options);
        fileTransfer.upload(tmpPath, this.uploadUrl, options, true).then(
          r => {
            console.log('Code = ' + r.responseCode);
            console.log('Response = ' + r.response);
            console.log('Sent = ' + r.bytesSent);
            this.isUploading = false;
            resolve(options.fileName);
          },
          err => {
            reject(err);
            alert('An error has occurred: Code = ' + err.code);
            console.log('upload error source ' + err.source);
            console.log('upload error target ' + err.target);
          }
        );

        fileTransfer.onProgress(progressEvent => {
          if (progressEvent.lengthComputable) {
            const progress = window.parseInt(
              progressEvent.loaded / progressEvent.total * 100,
              10
            );
            this.uploadProgress = progress;
          } else {
            this.uploadProgress += 14;
          }
        });
      }
    });
  }
}
