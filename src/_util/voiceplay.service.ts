/**
 * VoicePlay 服务
 */
import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { Events } from "ionic-angular";
import { GlobalService } from "../providers/global.service";

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Media, MediaObject } from "@ionic-native/media";
declare var window;

@Injectable()
export class VoicePlayService {
	mediaRec: MediaObject;

	constructor(
		public platform: Platform,
		private media: Media,
		public _global: GlobalService,
		private transfer: FileTransfer, private file: File
	) { }

	init() {}

	downloadVoiceFile(filename) {
		var targetPath = this.getBasePath() + 'voices/' + filename;
		const fileTransfer: FileTransferObject = this.transfer.create();
		// Download a file:
		let options = {};
		let trustHosts = true;
		fileTransfer.download(this._global.serverAddress+"/download/voicefile/"+filename, targetPath, 
		trustHosts,
		 options).then(result => {
			 console.log("下载完成,播放..");
			 this.play(targetPath);
		}).catch(err => {
			alert("下载音频文件出错");
			console.log("下载音频文件出错",err);
		});

		fileTransfer.onProgress((evt:ProgressEvent)=>{
			let progress = window.parseInt(evt.loaded /evt.total * 100);
			console.log(progress)
		})
	}

	getBasePath() {
		var basePath;
		if (this.platform.is("ios")) {
			basePath = window.cordova.file.documentsDirectory + "TomatoBang/";
		} else {
			basePath = window.cordova.file.externalApplicationStorageDirectory;
		}
		return basePath;
	}


	getFileName(url) {
        var arr = url.split('/');
        var fileName = arr[arr.length - 1];
        return fileName;
      }

	//检查路径中是否存在这个文件，并相应改变state
	checkFile(dataList) {
		var targetPath = this.getBasePath() + 'voices/';
		for (var i = 0; i < dataList.length; i++) {
			targetPath = this.getBasePath() + 'voices/';
			let index = i;
			// 0 代表未下载，3 代表下载完成
			this.file.checkFile(targetPath, this.getFileName(dataList[index].FilePath)).then(
				function (success) {
					dataList[index].state = 3;
				}, function (error) {
					dataList[index].state = 0;
				})
		}
	}

	/**
	 * 播放
	 * @param voiFile 文件路径
	 */
	play(voiFile) {
		if (this.mediaRec) {
			this.mediaRec.stop();
			this.mediaRec.release();
		}
		if (!voiFile) {
			return;
		}
		if (this.platform.is("IOS")) {
			voiFile = voiFile.replace("file://", "");
		}
		this.mediaRec = this.media.create(voiFile);

		this.mediaRec.onSuccess.subscribe(() => {
			// 播放完成
			console.log("play():Audio Success");
		});
		this.mediaRec.onError.subscribe(error => {
			// 播放失败
			console.log("play():Audio Error: ", error);
		});

		//开始播放录音
		this.mediaRec.play();
	}
}