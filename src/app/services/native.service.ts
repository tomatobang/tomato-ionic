/**
 * 常用原生服务
 *  - 极光推送
 *  - 网络状态监听
 *  - 屏幕常亮设置
 *  - 文件下载
 *  - 本地通知
 *  - 应用统计相关
 */

import { Injectable } from '@angular/core';
import { Platform, ToastController, NavController } from '@ionic/angular';
import { GlobalService } from './global.service';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Network } from '@ionic-native/network/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AppCenterAnalytics } from '@ionic-native/app-center-analytics/ngx';
import { AppCenterCrashes } from '@ionic-native/app-center-crashes/ngx';
import {
  FileTransfer,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { JPush } from '@jiguang-ionic/jpush/ngx';
import { InfoService } from '@services/info.service';

declare var window;

@Injectable({
  providedIn: 'root'
})
export class NativeService {
  headimgurl = {};

  private _isOffline = false;

  constructor(
    private platform: Platform,
    private globalservice: GlobalService,
    private insomnia: Insomnia,
    private toastCtrl: ToastController,
    private transfer: FileTransfer,
    private network: Network,
    private localNotifications: LocalNotifications,
    private appCenterAnalytics: AppCenterAnalytics,
    private appCenterCrashes: AppCenterCrashes,
    private file: File,
    private jpush: JPush,
    private navCtrl: NavController,
    private info: InfoService,
  ) { }


  initJPush() {
    document.addEventListener(
      'jpush.receiveNotification',
      (event: any) => {
        let content;
        if (this.isAndroid()) {
          content = event.alert;
        } else {
          content = event.aps.alert;
        }
        console.log('Receive notification: ' + JSON.stringify(event), content);
      },
      false
    );

    document.addEventListener(
      'jpush.openNotification',
      (event: any) => {
        let content;
        if (this.isAndroid()) {
          content = event.alert;
        } else {
          // iOS
          if (event.aps == undefined) {
            // 本地通知
            content = event.content;
          } else {
            // APNS
            content = event.aps.alert;
          }
        }
        this.jpush.setBadge(0);
        this.jpush.clearAllNotification().then(() => { });
        // 加载未读消息
        this.info.loadUnreadMsg();
        this.navCtrl.navigateForward(['tabs/friend/message']);
        console.log('open notification: ' + JSON.stringify(event), content);
      },
      false
    );

    document.addEventListener(
      'jpush.receiveLocalNotification',
      (event: any) => {
        // iOS(*,9) Only , iOS(10,*) 将在 jpush.openNotification 和 jpush.receiveNotification 中触发
        let content;
        if (this.isAndroid()) {
        } else {
          content = event.content;
        }
        console.log('receive local notification: ' + JSON.stringify(event), content);
      },
      false
    );
  }


  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  isIos(): boolean {
    return this.isMobile && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  initAppCenter() {
    this.appCenterAnalytics.setEnabled(true).then(() => {
      this.appCenterAnalytics
        .trackEvent('Init', { TEST: 'tomatobang' })
        .then(() => {
          console.log('AppCenter Analytics event tracked');
        });
    });

    this.appCenterCrashes.setEnabled(true).then(() => {
      this.appCenterCrashes.lastSessionCrashReport().then(report => {
        console.log('Crash report', report);
      });
    });
  }

  submitEvent(eventName, extra = {}) {
    this.appCenterAnalytics.isEnabled().then(() => {
      this.appCenterAnalytics
        .trackEvent(eventName, extra)
        .then(() => {
          console.log('AppCenter Analytics event:', eventName);
        });
    });
  }

  initNativeService() {
    this.listenInsomniaState();
    this.listenNetworkState();
    document.addEventListener('resume', () => {
      // 加载未读消息
      this.info.loadUnreadMsg();
    }, false);
  }

  isOffline() {
    return this._isOffline;
  }

  listenInsomniaState() {
    if (this.globalservice.isAlwaysLight) {
      this.insomnia
        .keepAwake()
        .then(
          () => console.log('insomnia init success'),
          e => console.log('insomnia init error', e)
        );
    }
  }

  async listenNetworkState() {

    const offlineOnlineThrottle = this.throttle(async msg => {
      if (this._isOffline === true) {
        this.createToast('网络中断');
      }
    }, 10000);
    this.network.onDisconnect().subscribe(() => {
      this._isOffline = true;
      console.log('network was disconnected :-(');
      offlineOnlineThrottle('OFFLINE！');
    });

    this.network.onConnect().subscribe(async () => {
      this._isOffline = false;
      this.createToast('网络已恢复');
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('got network:wifi!');
        }
      }, 3000);
    });
  }

  /**
   * throttle
   * @param fn
   * @param delay
   * @return Function
   */
  throttle(fn, delay) {
    let timer = null;
    return function (msg) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(msg);
      }, delay);
    };
  }

  /**
   * create toast
   * @param msg message to show
   */
  async createToast(msg = '') {
    const toast = await this.toastCtrl.create({
      message: msg,
      // duration: 3000,
      position: 'top',
      cssClass: 'my-toast-style',
      showCloseButton: true,
      closeButtonText: '关闭',
    });
    toast.present();
  }

  /**
   * 本地通知
   * @param obj
   */
  localNotify(obj: { id; text; sound?; data?; trigger?}) {
    this.localNotifications.schedule([obj]);
  }

  getBasePath() {
    let basePath;
    if (this.platform.is('ios')) {
      basePath = window.cordova.file.documentsDirectory + 'TomatoBang/';
    } else {
      basePath = window.cordova.file.externalApplicationStorageDirectory;
    }
    return basePath;
  }

  downloadHeadImg(filename, change, remotepath) {
    const targetPath = this.getBasePath() + 'headimg/';
    const targetPathWithFileName =
      this.getBasePath() + 'headimg/' + filename + '.png';
    if (this.headimgurl && this.headimgurl[filename] && !change) {
      return new Promise((resolve, reject) => {
        resolve(this.headimgurl[filename]);
      });
    }

    return new Promise((resolve, reject) => {
      // 检查是否已下载过
      this.file.checkFile(targetPath, filename + '.png').then(
        success => {
          if (change) {
            // 先删除本地文件再下载
            this.file.removeFile(targetPath, filename + '.png').then(() => {
              this.filedownload(remotepath, targetPathWithFileName).then(
                (file: any) => {
                  this.headimgurl[filename] = file;
                  resolve(file);
                },
                err => {
                  reject(err);
                }
              );
            });
          } else {
            // 直接使用本地文件
            this.headimgurl[filename] = targetPathWithFileName;
            resolve(targetPathWithFileName);
          }
        },
        error => {
          this.filedownload(remotepath, targetPathWithFileName).then(
            (file: any) => {
              this.headimgurl[filename] = file;
              resolve(file);
            },
            err => {
              reject(err);
            }
          );
        }
      );
    });
  }

  /**
   * @deprecated see:https://cordova.apache.org/blog/2017/10/18/from-filetransfer-to-xhr2.html
   * file download
   * @param remotepath
   * @param targetPathWithFileName
   */
  filedownload(remotepath, targetPathWithFileName) {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          Authorization: this.globalservice.token,
        },
      };
      const trustHosts = true;
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer
        .download(
          window.encodeURI(remotepath),
          targetPathWithFileName,
          trustHosts,
          options
        )
        .then(result => {
          resolve(result.toURL());
        })
        .catch(err => {
          reject(err);
        });
      fileTransfer.onProgress((evt: ProgressEvent) => {
        // show download progress
      });
    });
  }

  /**
   * get files by prefix
   */
  getFiles(prefix: string): Promise<FileEntry[]> {
    return new Promise((resolve, reject) => {
      window.requestFileSystem(
        LocalFileSystem.PERSISTENT,
        0,
        fs => {
          fs.root.createReader().readEntries((entries: FileEntry[]) => {
            resolve(entries.filter(e => e.isFile && e.name.includes(prefix)));
          }, reject);
        },
        reject
      );
    });
  }

  /**
   * get files from local or download from server
   */
  getLocalFileOrDowload(
    remoteFileUri: string,
    fileName: string,
    prefix: string,
    onProgress?: (e: ProgressEvent) => void
  ): Promise<FileEntry> {
    return new Promise((resolve, reject) => {
      window.requestFileSystem(
        LocalFileSystem.PERSISTENT,
        0,
        fs => {
          fs.root.getFile(
            prefix + fileName,
            undefined,
            fe => {
              fe.file(f => {
                if (f.size > 0) {
                  resolve(fe);
                } else {
                  this.syncRemoteFile(
                    fs,
                    remoteFileUri,
                    fileName,
                    prefix,
                    onProgress
                  )
                    .then(resolve)
                    .catch(reject);
                }
              }, reject);
            },
            (err: FileError) => {
              if (err.code === FileError.NOT_FOUND_ERR) {
                this.syncRemoteFile(
                  fs,
                  remoteFileUri,
                  fileName,
                  prefix,
                  onProgress
                )
                  .then(resolve)
                  .catch(reject);
              } else {
                reject(err);
              }
            }
          );
        },
        reject
      );
    });
  }

  syncRemoteFile(
    fs: FileSystem,
    remoteFileUri: string,
    fileName: string,
    prefix: string,
    onProgress?: (e: ProgressEvent) => void
  ): Promise<FileEntry> {
    return new Promise((resolve, reject) => {
      fs.root.getFile(
        prefix + fileName,
        { create: true, exclusive: false },
        fileEntry =>
          this.download(fileEntry, remoteFileUri, onProgress)
            .then(resolve)
            .catch(err => {
              // a zero lenght file is created while trying to download and save
              fileEntry.remove(() => { });
              reject(err);
            }),
        reject
      );
    });
  }

  download(
    fileEntry: FileEntry,
    remoteURI: string,
    onProgress?: (e: ProgressEvent) => void
  ): Promise<FileEntry> {
    return new Promise((resolve, reject) => {
      const client = new XMLHttpRequest();
      client.open('GET', remoteURI, true);
      client.responseType = 'blob';
      if (onProgress) {
        client.onprogress = onProgress;
      }
      client.onload = () => {
        const blob = client.response;
        if (blob) {
          fileEntry.createWriter(fileWriter => {
            fileWriter.onwriteend = () => resolve(fileEntry);
            fileWriter.onerror = reject;
            fileWriter.write(blob);
          }, reject);
        } else {
          reject('could not get file');
        }
      };
      client.send();
    });
  }
}
