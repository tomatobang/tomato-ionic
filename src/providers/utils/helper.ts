/**
 * 辅助类
 */
import { Injectable } from "@angular/core";

import { Platform } from "ionic-angular";
declare var window;


@Injectable()
export class Helper {
    constructor(
        public platform: Platform
    ) { }
    

    init() {
    }

    getBasePath() {
        let basePath;
        if (this.platform.is("ios")) {
            basePath = window.cordova.file.documentsDirectory + "TomatoBang/";
        } else {
            basePath = window.cordova.file.externalApplicationStorageDirectory;
        }
        return basePath;
    }

    isWeb(){
        return !this.platform.is("ios") && !this.platform.is("andorid");
    }
}