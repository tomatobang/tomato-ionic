/*
 * @Author: kobepeng 
 * @Date: 2017-11-25 09:29:39 
 * @Last Modified by:   kobepeng 
 * @Last Modified time: 2017-11-25 09:29:39 
 */
import { Injectable } from "@angular/core";
import { Platform, AlertController, LoadingController, ToastController } from "ionic-angular";
import { GlobalService } from "../global.service";
import { Insomnia } from '@ionic-native/insomnia';
import { Network } from '@ionic-native/network';

declare var window;

@Injectable()
export class NativeService {
    constructor(
        public platform: Platform,
        public _global: GlobalService,
        private insomnia: Insomnia,
        private toastCtrl: ToastController,
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
        if (this._global.isAlwaysLight) {
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
            cssClass:"my-toast-style"
        });
        toast.present();
    }


}

