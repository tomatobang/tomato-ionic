import { Injectable } from '@angular/core';
import {
  Platform,
  AlertController,
  LoadingController,
  ToastController,
  Toast,
} from 'ionic-angular';
import { GlobalService } from '../global.service';
import { Insomnia } from '@ionic-native/insomnia';
import { Network } from '@ionic-native/network';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Helper } from './helper';

declare var window;

@Injectable()
export class NativeService {
  headimgurl: String;
  toast: Toast;

  private isOffline = false;

  constructor(
    public platform: Platform,
    public globalservice: GlobalService,
    private insomnia: Insomnia,
    private toastCtrl: ToastController,
    private transfer: FileTransfer,
    private file: File,
    private helper: Helper,
    private network: Network
  ) {}

  /**
   * 初始化
   */
  init() {}

  /**
   * 初始化 Native 服务
   */
  initNativeService() {
    this.listenInsomniaState();
    this.listenNetworkState();
  }

  /**
   * 监听屏幕显示状态
   */
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

  /**
   * 监听网络状态
   */
  listenNetworkState() {
    this.createToast();
    const offlineOnlineThrottle = this.throttle(msg => {
      if (this.isOffline === true) {
        this.toast.setMessage(msg);
        this.toast.present();
      }
    }, 2400);
    this.network.onDisconnect().subscribe(() => {
      this.isOffline = true;
      console.log('network was disconnected :-(');
      offlineOnlineThrottle('网络已断开！');
    });

    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.isOffline = false;
      this.toast.dismissAll();
      // offlineOnlineThrottle('网络已连接！');
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });
  }

  /**
   * 函数节流方法
   * @param Function fn 延时调用函数
   * @param Number delay 延迟多长时间
   * @return Function 延迟执行的方法
   */
  throttle(fn, delay) {
    let timer = null;
    return function(msg) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(msg);
      }, delay);
    };
  }

  /**
   * 显示消息
   * @param msg 消息
   */
  createToast() {
    this.toast = this.toastCtrl.create({
      message: '',
      // duration: 3000,
      position: 'top',
      cssClass: 'my-toast-style',
      showCloseButton: true,
      closeButtonText: '关闭',
      dismissOnPageChange: true,
    });
  }

  /**
   * 下载头像
   * @param filename 文件名称
   * @param change 是否为更换头像
   */
  downloadHeadImg(filename, change, remotepath): Promise<any> {
    const targetPath = this.helper.getBasePath() + 'headimg/';
    const targetPathWithFileName =
      this.helper.getBasePath() + 'headimg/' + filename + '.png';
    if (this.headimgurl && !change) {
      return new Promise((resolve, reject) => {
        resolve(this.headimgurl);
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
                  this.headimgurl = file;
                  resolve(file);
                },
                err => {
                  reject(err);
                }
              );
            });
          } else {
            // 直接使用本地文件
            this.headimgurl = targetPathWithFileName;
            resolve(targetPathWithFileName);
          }
        },
        error => {
          this.filedownload(remotepath, targetPathWithFileName).then(
            (file: any) => {
              this.headimgurl = file;
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
   * 文件下载
   * @param remotepath
   * @param targetPathWithFileName 带文件名的下载地址
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
          remotepath,
          targetPathWithFileName,
          trustHosts,
          options
        )
        .then(result => {
          console.log('filedownload： 下载完成..');
          resolve(result.toURL());
        })
        .catch(err => {
          reject('ERR:下载出错');
          console.log('filedownload： 下载出错', err);
        });
      fileTransfer.onProgress((evt: ProgressEvent) => {
        console.log(evt);
      });
    });
  }
}
