/**
 * App 更新服务
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
        var appSystem = this.platform.is("android") ? 'android' : 'ios';
        this.getServerVersion(appSystem).subscribe(data => {
            var appVersionInfo = data.data;
            if (window.cordova) {
                // 注意区分测试版与正式版
                window.cordova.getAppVersion.getVersionNumber().then(function (version) {
                    if (appVersionInfo.Version > version && appVersionInfo.AppType === '1') {
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
        // var creds = "appSystem=" + appSystem;
        // return this.http.post('url',
        //     creds, this.interceptor()).map(res => res.json());

        return new Observable((responseObserver) => {
            responseObserver.next(1);
            responseObserver.complete();
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

    downloadApp(isAndroid, downloadUrl: string) {
        if (isAndroid) {
            var that = this;
            var trustHosts = true;
            var options = {};
            const fileTransfer = new Transfer();
            // APP下载存放的路径，可以使用 window.cordova file 插件进行相关配置
            window.resolveLocalFileSystemURL(window.cordova.file.externalApplicationStorageDirectory, function (fileEntry) {
                fileEntry.getDirectory("Download", { create: true, exclusive: false }, function (fileEntry) {
                    const targetPath: string = fileEntry.toInternalURL() + "TomatoBang.apk";
                    let loading = null;
                    fileTransfer.download(downloadUrl, targetPath, trustHosts, options).then(function (result) {
                        FileOpener.open(targetPath, 'application/vnd.android.package-archive');
                        if (loading) {
                            loading.dismiss();
                        }
                    }, function (error) {
                        let alert = this.alertCtrl.create({
                            title: '下载失败!',
                            buttons: ['OK']
                        });
                        alert.present();
                        if (loading) {
                            loading.dismiss();
                        }
                    });
                    // 显示下载进度
                    fileTransfer.onProgress(function (progress) {
                        setTimeout(function () {
                            var downloadProgress = (progress.loaded / progress.total) * 100;
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