/**
 * App 更新服务( Android )
 * (暂未启用)
 */
import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { Platform, AlertController, LoadingController } from "ionic-angular";
import { GlobalService } from "../providers/global.service";
import { Transfer, FileOpener } from 'ionic-native';
import { Subject, Observable } from 'rxjs'

declare var window;

@Injectable()
export class UpdateService {
    headers: Headers = new Headers()
    constructor(
        public platform: Platform,
        public _global: GlobalService,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public http: Http
    ) {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    }

    init() {
    }

    checkUpdate() {
        let appSystem = this.platform.is("android") ? 'android' : 'ios';
        this.getServerVersion(appSystem).subscribe(data => {
            let appVersionInfo = data.data;
            if (window.cordova) {
                // 注意区分测试版与正式版
                window.cordova.getAppVersion.getVersionNumber().then((version) => {
                    if (appVersionInfo.Version > version) {
                        this.showUpdateConfirm(appVersionInfo.Content, appVersionInfo.DownloadUrl);
                    }
                });
            }
        })
    }


    /**
    * [getServerVersion 获取最新版本号]
    * @param  {[type]}  appSystem [系统名称]
    */
    getServerVersion(appSystem): Observable<any> {
        return new Observable((responseObserver) => {
            this.http.post(this._global.serverAddress + 'api/version',
                {}, this.interceptor()).map(res => {
                    responseObserver.next(res.json());
                    responseObserver.complete();
                });
        });
    }

    /**
     * 请求头处理
     */
    interceptor(): RequestOptions {
        const opts: RequestOptions = new RequestOptions()
        opts.headers = this.headers
        return opts
    }

    showUpdateConfirm(updateContent, downloadUrl) {
        let prompt = this.alertCtrl.create({
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
                        this.downloadApp(this.platform.is("android"), downloadUrl);
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
            let that = this;
            let trustHosts = true;
            let options = {};
            const fileTransfer = new Transfer();
            // APP下载存放的路径，可以使用 window.cordova file 插件进行相关配置
            window.resolveLocalFileSystemURL(window.cordova.file.externalApplicationStorageDirectory, (fileEntry) => {
                fileEntry.getDirectory("Download", { create: true, exclusive: false }, (fileEntry) => {
                    const targetPath: string = fileEntry.toInternalURL() + "TomatoBang.apk";
                    let loading = null;
                    fileTransfer.download(downloadUrl, targetPath, trustHosts, options).then((result) => {
                        FileOpener.open(targetPath, 'application/vnd.android.package-archive');
                        if (loading) {
                            loading.dismiss();
                        }
                    }, (error) => {
                        let alert = this.alertCtrl.create({
                            title: '下载失败!',
                            buttons: ['OK']
                        });
                        alert.present();
                        if (loading) {
                            loading.dismiss();
                        }
                    });
                    // 下载进度
                    fileTransfer.onProgress((progress) => {
                        setTimeout(() => {
                            let downloadProgress = (progress.loaded / progress.total) * 100;
                            loading = that.loadingCtrl.create({
                                content: "已经下载：" + Math.floor(downloadProgress) + "%"
                            });
                            if (downloadProgress == 100) {
                                loading.dismiss();
                            }
                        });
                    });
                });
            });
        } else {
            // ios 跳转到 app store
            window.location.href = downloadUrl;
        }
    }
}