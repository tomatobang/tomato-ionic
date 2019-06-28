/**
 * utils
 */
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { WebView } from '@ionic-native/ionic-webview/ngx'

import { Platform } from '@ionic/angular';
declare var window;

@Injectable({
  providedIn: 'root',
})
export class Helper {
  constructor(public webView: WebView, public platform: Platform, private sanitizer: DomSanitizer) { }

  getBasePath() {
    let basePath;
    if (this.platform.is('ios')) {
      basePath = window.cordova.file.documentsDirectory + 'TomatoBang/';
    } else {
      basePath = window.cordova.file.externalApplicationStorageDirectory;
    }
    return basePath;
  }

  isWeb() {
    return !this.platform.is('ios') && !this.platform.is('android');
  }

  minuteSpan(startTime, endTime) {
    const timeSpan =
      new Date(endTime).getTime() - new Date(startTime).getTime();
    const minutes = Math.floor((timeSpan % (3600 * 1000)) / (60 * 1000));
    return minutes;
  }

  secondsToMMSS(timeInSeconds: number) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds - minutes * 60;
    let retStr = '';
    if (minutes < 10) {
      retStr += '0' + minutes;
    } else {
      retStr += minutes;
    }
    retStr += ':';
    if (seconds < 10) {
      retStr += '0' + seconds;
    } else {
      retStr += seconds;
    }
    return retStr;
  }

  /**
   * 获取文件名称
   * @param url
   */
  getFileName(url) {
    const arr = url.split('/');
    const fileName = arr[arr.length - 1];
    return fileName;
  }

  dealWithLocalUrl(url): SafeUrl {
    if (window.cordova) {
      url = this.webView.convertFileSrc(url) + '?' + new Date().getTime();
      url = this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return url;
  }
}
