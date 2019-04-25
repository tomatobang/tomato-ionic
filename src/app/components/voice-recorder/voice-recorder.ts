import { Component, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { PopoverController } from '@ionic/angular';
declare let window;

@Component({
  selector: 'voice-recorder',
  providers: [Media, FileTransfer],//
  templateUrl: './voice-recorder.html',
  styleUrls: ['voice-recorder.scss'],
})
export class VoiceRecorderComponent implements OnInit, OnDestroy {
  uploadMediaFilepath: string;

  element: HTMLElement;
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

  constructor(
    private media: Media,
    private platform: Platform,
    private elRef: ElementRef,
    private transfer: FileTransfer,
    // private qiniu: QiniuUploadService,
    private popoverCtrl: PopoverController,
  ) {
    this.element = this.elRef.nativeElement;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
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
    this.setFileName();
    this.mediaRec = this.media.create(this.getNewMediaURL(this.mediaSrc));
    this.mediaRec.onStatusUpdate.subscribe(status => console.log(status));
    this.mediaRec.onSuccess.subscribe(() => console.log('audio is successful'));
    this.mediaRec.onError.subscribe(error => console.log('Error!', error));

    this.startVoiceRecordAnimate();
  }

  setFileName(){
    this.mediaSrc = new Date().getTime() + '';
    if (this.platform.is('ios')) {
      this.mediaPath = window.cordova
        ? window.cordova.file.documentsDirectory
        : '';
      this.mediaSrc += '.m4a';
    } else {
      this.mediaPath = window.cordova
        ? window.cordova.file.externalApplicationStorageDirectory
        : '';
      this.mediaSrc += '.mp3';
    }
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
        if (this.mediaRec) {
          this.mediaRec.release();
        }
        this.popoverCtrl.dismiss({
          uploadMediaFilepath: this.uploadMediaFilepath,
          mediaSrc: this.getMediaPlayURL(this.mediaSrc),
          voiceDuration: this.voiceDuration
        });
      }
    }, 100);
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
}
