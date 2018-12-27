/**
 * App update service
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, AlertController, LoadingController } from 'ionic-angular';
import { GlobalService } from '../global.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';

import { Observable } from 'rxjs/Observable';

declare var window;

@Injectable()
export class UpdateService {
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  });
  constructor(
    public platform: Platform,
    public _global: GlobalService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    public transfer: FileTransfer,
    private fileOpener: FileOpener
  ) {}

  checkUpdate() {
    const appSystem = this.platform.is('android') ? 'android' : 'ios';
    this.getServerVersion(appSystem).subscribe(data => {
      let appVersionInfo;
      if (data && data.length > 0) {
        appVersionInfo = data[0];
      }
      if (window.cordova) {
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
   * compare version
   * @param curV current version number
   * @param reqV request version number
   */
  compare(curV, reqV) {
    if (curV && reqV) {
      const arr1 = curV.split('.');
      const arr2 = reqV.split('.');
      const minLength = Math.min(arr1.length, arr2.length);
      let diff = 0,
        position = 0;
      while (
        position < minLength &&
        (diff = parseInt(arr1[position], 10) - parseInt(arr2[position], 10)) ===
          0
      ) {
        position++;
      }
      diff = diff !== 0 ? diff : arr1.length - arr2.length;
      return diff > 0;
    } else {
      console.log('version number should not be empty');
      return false;
    }
  }

  /**
   * get version number from server end
   * @param OS OS type 
   */
  getServerVersion(OS): Observable<any> {
    return new Observable(responseObserver => {
      this.http
        .get(this._global.serverAddress + 'api/version', {})
        .subscribe(res => {
          responseObserver.next(res);
          responseObserver.complete();
        });
    });
  }

  /**
   * update comfirm modal
   * @param updateContent update content
   * @param downloadUrl url to download apk file
   */
  showUpdateConfirm(updateContent, downloadUrl) {
    const prompt = this.alertCtrl.create({
      title: '发现新版本',
      message: updateContent,
      buttons: [
        {
          text: '以后再说',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: '立即升级',
          handler: () => {
            this.downloadApp(this.platform.is('android'), downloadUrl);
          },
        },
      ],
    });
    prompt.present();
  }

  /**
   * Android apk file download
   * @param isAndroid
   * @param downloadUrl
   */
  downloadApp(isAndroid, downloadUrl: string) {
    if (isAndroid) {
      const trustHosts = true;
      const options = {};
      const fileTransfer: FileTransferObject = this.transfer.create();
      window.resolveLocalFileSystemURL(
        window.cordova.file.externalApplicationStorageDirectory,
        fileEntry => {
          fileEntry.getDirectory(
            'Download',
            { create: true, exclusive: false },
            dir => {
              const targetPath: string = dir.toInternalURL() + 'TomatoBang.apk';
              let loading = null;
              loading = this.loadingCtrl.create({
                content: `下载中...`,
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
                      buttons: ['OK'],
                    });
                    alert.present();
                  }
                );
              fileTransfer.onProgress((evt: ProgressEvent) => {
                const downloadProgress = window.parseInt(
                  (evt.loaded / evt.total) * 100,
                  10
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
      // ios to app store
      window.location.href = downloadUrl;
    }
  }
}
