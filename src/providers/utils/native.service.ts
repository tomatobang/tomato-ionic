import { Injectable } from "@angular/core";
import { Platform, AlertController, LoadingController } from "ionic-angular";
import { GlobalService } from "../global.service";
import { Insomnia } from '@ionic-native/insomnia';

declare var window;

@Injectable()
export class NativeService {
    constructor(
        public platform: Platform,
        public _global: GlobalService,
        private insomnia: Insomnia) { }

    /**
     * 初始化
     */
    init() { }

    /**
     * 初始化 Native 服务
     */
    initNativeService() {
        if (this._global.isAlwaysLight) {
            this.insomnia.keepAwake()
                .then(
                () => console.log('insomnia init success'),
                (e) => console.log('insomnia init error', e)
                );
        }
    }


}