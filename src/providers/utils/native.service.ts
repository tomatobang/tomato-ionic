/*
 * @Author: kobepeng 
 * @Date: 2017-11-25 09:29:39 
 * @Last Modified by: kobepeng
 * @Last Modified time: 2017-12-02 11:06:46
 */
import { Injectable } from "@angular/core";
import { Platform, AlertController, LoadingController, ToastController } from "ionic-angular";
import { GlobalService } from "../global.service";
import { Insomnia } from '@ionic-native/insomnia';
import { Network } from '@ionic-native/network';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Helper } from './helper';


declare var window;

@Injectable()
export class NativeService {
    _headimgurl: String;

    constructor(
        public platform: Platform,
        public globalservice: GlobalService,
        private insomnia: Insomnia,
        private toastCtrl: ToastController,
        private transfer: FileTransfer,
        private file: File,
        private helper: Helper,
        private network: Network) { }

    /**
     * 初始化
     */
    init() { }

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
            this.insomnia.keepAwake()
                .then(() => console.log('insomnia init success'),
                (e) => console.log('insomnia init error', e)
                );
        }
    }

    /**
     * 监听网络状态
     */
    listenNetworkState() {
        this.network.onDisconnect().subscribe(() => {
            console.log('network was disconnected :-(');
            this.presentToast("网络已断开！");
        });

        this.network.onConnect().subscribe(() => {
            console.log('network connected!');
            this.presentToast("网络已连接！");
            setTimeout(() => {
                if (this.network.type === 'wifi') {
                    console.log('we got a wifi connection, woohoo!');
                }
            }, 3000);
        });
    }

    /**
     * 显示消息
     * @param msg 消息
     */
    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: "top",
            cssClass: "my-toast-style"
        });
        toast.present();
    }


	/**
	 * 下载头像
	 * @param filename 
	 * @param change 
	 */
    downloadHeadImg(filename, change): Promise<any> {
        let targetPath = this.helper.getBasePath() + 'headimg/';
        let targetPathWithFileName = this.helper.getBasePath() + 'headimg/' + filename + ".png";
        if (this._headimgurl && !change) {
            return new Promise((resolve, reject) => {
                resolve(this._headimgurl);
            })
        }

        return new Promise((resolve, reject) => {
            // 检查是否已下载过
            this.file.checkFile(targetPath, filename + ".png").then(
                (success) => {
                    if (change) {
                        // 先删除本地文件再下载
                        this.file.removeFile(targetPath, filename + ".png").then(() => {
                            this.filedownload(filename, targetPathWithFileName).then((file: any) => {
                                this._headimgurl = file;
                                resolve(file);
                            }, (err) => {
                                reject(err);
                            });
                        })
                    } else {
                        // 直接使用本地文件
                        this._headimgurl = targetPathWithFileName;
                        resolve(targetPathWithFileName);
                    }
                }, (error) => {
                    this.filedownload(filename, targetPathWithFileName).then((file: any) => {
                        this._headimgurl = file;
                        resolve(file)
                    }, (err) => {
                        reject(err)
                    });
                });
        })
    }

	/**
	 * 文件下载
	 * @param filename 
	 * @param targetPathWithFileName 
	 */
    filedownload(filename, targetPathWithFileName) {
        return new Promise((resolve, reject) => {
            let options = {
                headers: {
                    Authorization: this.globalservice.token
                }
            };
            let trustHosts = true;
            const fileTransfer: FileTransferObject = this.transfer.create();
            fileTransfer.download(this.globalservice.serverAddress + "api/user/headimg/" + filename,
                targetPathWithFileName, trustHosts,
                options).then(result => {
                    console.log("Headmg 下载完成..");
                    resolve(result.toURL());
                }).catch(err => {
                    reject("Headmg 下载出错");
                    console.log("Headmg 下载出错", err);
                });
            fileTransfer.onProgress((evt: ProgressEvent) => {
                console.log(evt)
            })
        });

    }


}

