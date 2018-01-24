/*
 * @Author: kobepeng
 * @Date: 2017-11-22 14:15:36
 * @Last Modified by:   kobepeng
 * @Last Modified time: 2017-11-22 14:15:36
 */
/**
 * App 更新服务( Android )
 * (暂未启用)
 */
import { Injectable } from '@angular/core';
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  URLSearchParams
} from '@angular/http';
import { Platform, AlertController, LoadingController } from 'ionic-angular';
import { GlobalService } from '../global.service';
// import {  FileOpener } from 'ionic-native';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';

import { Subject, Observable } from 'rxjs';
import { loadavg } from 'os';

declare var window;

@Injectable()
export class UpdateService {
  headers: Headers = new Headers();
  constructor(
    public platform: Platform,
    public _global: GlobalService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public http: Http,
    public transfer: FileTransfer,
    private fileOpener: FileOpener
  ) {
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }

  /**
   * 初始化
   */
  init() {}

  /**
   * 检查更新
   */
  checkUpdate() {
    const appSystem = this.platform.is('android') ? 'android' : 'ios';
    this.getServerVersion(appSystem).subscribe(data => {
      let appVersionInfo;
      if (data && data.length > 0) {
        appVersionInfo = data[0];
      }
      if (window.cordova) {
        // 注意区分测试版与正式版
        window.cordova.getAppVersion.getVersionNumber().then(version => {
          if (this.compare(appVersionInfo.version, version)) {
            this.showUpdateConfirm(
              appVersionInfo.Content,
              appVersionInfo.downloadUrl
            );
          }
        });
      }
    });
  }

  /**
   * 版本号对比
   * @param curV 当前版本
   * @param reqV 请求版本
   */
  compare(curV, reqV) {
    if (curV && reqV) {
      const arr1 = curV.split('.'),
        arr2 = reqV.split('.');
      let minLength = Math.min(arr1.length, arr2.length),
        position = 0,
        diff = 0;
      while (
        position < minLength &&
        (diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0
      ) {
        position++;
      }
      diff = diff != 0 ? diff : arr1.length - arr2.length;
      return diff > 0;
    } else {
      console.log('版本号不能为空');
      return false;
    }
  }

  /**
   * [getServerVersion 获取最新版本号]
   * @param  {[type]}  appSystem [系统名称]
   */
  getServerVersion(appSystem): Observable<any> {
    return new Observable(responseObserver => {
      this.http
        .get(this._global.serverAddress + 'api/version', {})
        .subscribe(res => {
          responseObserver.next(res.json());
          responseObserver.complete();
        });
    });
  }

  /**
   * 请求头处理
   */
  interceptor(): RequestOptions {
    const opts: RequestOptions = new RequestOptions();
    opts.headers = this.headers;
    return opts;
  }

  /**
   * 更新提示框
   * @param updateContent 内容
   * @param downloadUrl 下载地址
   */
  showUpdateConfirm(updateContent, downloadUrl) {
    const prompt = this.alertCtrl.create({
      title: '发现新版本',
      message: updateContent,
      buttons: [
        {
          text: '以后再说',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '立即升级',
          handler: data => {
            this.downloadApp(this.platform.is('android'), downloadUrl);
          }
        }
      ]
    });
    prompt.present();
  }

  /**
   * Android 版下载
   * @param isAndroid
   * @param downloadUrl
   */
  downloadApp(isAndroid, downloadUrl: string) {
    if (isAndroid) {
      const trustHosts = true;
      const options = {};
      const fileTransfer: FileTransferObject = this.transfer.create();
      // APP下载存放的路径，可以使用 window.cordova file 插件进行相关配置
      window.resolveLocalFileSystemURL(
        window.cordova.file.externalApplicationStorageDirectory,
        fileEntry => {
          fileEntry.getDirectory(
            'Download',
            { create: true, exclusive: false },
            fileEntry => {
              const targetPath: string =
                fileEntry.toInternalURL() + 'TomatoBang.apk';
              let loading = null;
              loading = this.loadingCtrl.create({
                content: `下载中...`
              });
              loading.present();
              fileTransfer
                .download(downloadUrl, targetPath, trustHosts, options)
                .then(
                  result => {
                    this.fileOpener.open(
                      targetPath,
                      'application/vnd.android.package-archive'
                    );
                    if (loading) {
                      loading.dismiss();
                    }
                  },
                  error => {
                    if (loading) {
                      loading.dismiss();
                    }
                    const alert = this.alertCtrl.create({
                      title: '下载失败!',
                      buttons: ['OK']
                    });
                    alert.present();
                  }
                );
              // 下载进度
              fileTransfer.onProgress((evt: ProgressEvent) => {
                const downloadProgress = window.parseInt(
                  evt.loaded / evt.total * 100
                );
                loading.data.content = `<div>已下载${downloadProgress}%</div>`;
                if (downloadProgress >= 100) {
                  loading.dismiss();
                }
              });
            }
          );
        }
      );
    } else {
      // ios 跳转到 app store
      window.location.href = downloadUrl;
    }
  }
}
