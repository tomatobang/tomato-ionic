import { Component, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GestureController } from '@ionic/core/dist/collection/utils/gesture/gesture-controller';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { QiniuUploadService } from '@services/qiniu.upload.service';

declare let window;

@Component({
  selector: 'voice-recorder',
  providers: [Media, FileTransfer],
  templateUrl: './voice-recorder.html',
})
export class VoiceRecorderComponent implements OnInit, OnDestroy {
  couldPlay = false;
  uploadMediaFilepath: string;
  uploadUrl: string;
  isUploading = false;
  uploadProgress = 0;

  element: HTMLElement;
  pressGesture: GestureController;
  isStartRecord = false;
  recordWait = false;
  isStartedVoice = false;
  mediaRec: MediaObject;
  // media src
  mediaSrc = '';
  // media path
  mediaPath = '';
  voiceDuration = '0';
  voice = {
    ImgUrl: './assets/voice/recog000.png',
    reset() {
      this.ImgUrl = './assets/voice/recog000.png';
    },
  };

  _postParams: any;

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
    private transfer: FileTransfer,
    private qiniu: QiniuUploadService
  ) {
    if (this.platform.is('ios')) {
      this.mediaPath = window.cordova
        ? window.cordova.file.documentsDirectory
        : '';
      this.mediaSrc = 'cordovaIMVoice.m4a';
    } else {
      this.mediaPath = window.cordova
        ? window.cordova.file.externalApplicationStorageDirectory
        : '';
      this.mediaSrc = 'cordovaIMVoice.mp3';
    }
    this.element = elRef.nativeElement;
  }

  ngOnInit() {
    this.pressGesture = new GestureController(this.element, { time: 200 });
    this.pressGesture.listen();

    this.pressGesture.on('press', e => {
      console.log('press');
      this.onHold();
    });
    this.element.onpointerleave = () => {
      console.log('onpointerleave');
      this.onRecordEnd();
    };

    this.element.ontouchend = () => {
      console.log('ontouchend');
      this.onRecordEnd();
    };
    this.element.ontouchcancel = () => {
      console.log('ontouchcancel');
      this.onRecordEnd();
    };
  }

  ngOnDestroy() {
    this.pressGesture.destroy();
  }

  /**
   * 录音结束
   */
  onRecordEnd() {
    this.recordWait = true;
    this.voice.reset();
    this.onRelease();
  }

  /**
   * 录音开始
   */
  onHold() {
    this.isStartRecord = true;
    this.recordWait = false;
    try {
      // 初始化录音
      this.initRecordMedia();
      // 开始录音
      this.mediaRec.startRecord();
      // 开始标识置 true
      this.isStartedVoice = true;
    } catch (err) {
      console.log(err);
    }
  }

  initRecordMedia() {
    if (this.mediaRec) {
      this.mediaRec.release();
    }
    this.mediaRec = this.media.create(this.getNewMediaURL(this.mediaSrc));
    this.mediaRec.onStatusUpdate.subscribe(status => console.log(status));
    this.mediaRec.onSuccess.subscribe(() => console.log('audio is successful'));
    this.mediaRec.onError.subscribe(error => console.log('Error!', error));

    this.startVoiceRecordAnimate();
  }

  /**
   * 录音动画
   */
  startVoiceRecordAnimate() {
    const voicechange = setInterval(() => {
      if (!this.recordWait) {
        const i = Math.round(Math.random() * 9);
        this.voice.ImgUrl = 'assets/voice/recog00' + i + '.png';
      } else {
        clearInterval(voicechange);
      }
    }, 400);
  }

  onRelease() {
    if (!this.isStartedVoice) {
      return;
    }
    this.isStartedVoice = false;
    this.recordWait = true;
    setTimeout(() => {
      this.isStartRecord = false;
    }, 1000);
    if (this.mediaRec) {
      this.mediaRec.stopRecord();
      this.mediaRec.release();
    }
    this.mediaRec = this.media.create(this.getMediaPlayURL(this.mediaSrc));
    this.mediaRec.onSuccess.subscribe(() =>
      console.log('touchend():Audio Success')
    );
    this.mediaRec.onError.subscribe(error =>
      console.log('touchend():Audio Error:', error)
    );
    this.mediaRec.play();
    this.mediaRec.stop();

    let counter = 0;
    const timerDur = setInterval(() => {
      counter = counter + 100;
      if (counter > 2000) {
        clearInterval(timerDur);
      }
      const dur = this.mediaRec.getDuration();
      if (dur > 0) {
        clearInterval(timerDur);
        let tmpPath = this.getMediaPlayURL(this.mediaSrc);
        if (this.platform.is('ios')) {
          tmpPath = this.mediaPath + this.mediaSrc;
        }
        this.uploadMediaFilepath = tmpPath.replace('file://', '');
        this.voiceDuration = dur.toFixed(1);
        this.couldPlay = true;
        if (this.mediaRec) {
          this.mediaRec.release();
        }
      }
    }, 100);
  }

  /**
   * 播放录音文件
   * @param filepath 媒体路径
   */
  play(filepath) {
    if (this.mediaRec) {
      this.mediaRec.stop();
      this.mediaRec.release();
    }
    if (!filepath) {
      filepath = this.getNewMediaURL(this.mediaSrc);
    }
    if (this.platform.is('ios')) {
      filepath = filepath.replace('file://', '');
    }
    this.mediaRec = this.media.create(filepath);

    this.mediaRec.onSuccess.subscribe(() => {
      console.log('play():Audio Success');
    });
    this.mediaRec.onError.subscribe(error => {
      console.log('play():Audio Error: ', error);
    });

    this.mediaRec.play();
  }

  /**
   * 获取新媒体路径
   * @param mediaSrc
   */
  getNewMediaURL(mediaSrc) {
    if (this.platform.is('android')) {
      return this.mediaPath + mediaSrc;
    } else {
      // ios
      return 'documents://' + mediaSrc;
    }
  }

  getMediaPlayURL(mediaSrc) {
    if (this.platform.is('android')) {
      return this.mediaPath + mediaSrc;
    } else {
      // ios
      return (this.mediaPath + mediaSrc).replace('file://', '');
    }
  }

  /**
   * 上传录音文件至七牛
   */
  uploadVoiceFile() {
    return new Promise((resolve, reject) => {
      this.isUploading = true;
      if (!this.uploadMediaFilepath) {
        reject('没有录音!');
      }
      const fileName = this.uploadMediaFilepath.substr(
        this.uploadMediaFilepath.lastIndexOf('/') + 1
      );

      this.qiniu.initQiniu().subscribe(data => {
        if (data) {
          this.qiniu
            .uploadLocFile(
              this.uploadMediaFilepath,
              this._postParams.userid +
                '_' +
                this._postParams.taskid +
                '_' +
                fileName
            )
            .subscribe(ret => {
              if (ret.data) {
                this.isUploading = false;
                resolve(fileName);
              } else {
                this.uploadProgress = ret.value;
              }
            });
        }
      });
    });
  }
}
