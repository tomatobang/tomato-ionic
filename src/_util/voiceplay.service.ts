/**
 * VoicePlay 服务
 */
import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { GlobalService } from "../providers/global.service";

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
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

	init() { }

	downloadVoiceFile(filename) {
		let targetPath = this.getBasePath() + 'voices/';
		let targetPathWithFileName = this.getBasePath() + 'voices/' + filename;
		// 检查是否已下载过
		this.file.checkFile(targetPath, filename).then(
			 (success)=> {
				alert("已经下载,直接播放！");
				this.play(targetPathWithFileName);
			},  (error)=> {
				// 注意:此方法采用追加的方式添加
				let options = {};
				let trustHosts = true;
				const fileTransfer: FileTransferObject = this.transfer.create();
				fileTransfer.download(this._global.serverAddress + "/download/voicefile/" + filename, targetPathWithFileName,
					trustHosts,
					options).then(result => {
						console.log("下载完成,播放..");
						this.play(targetPathWithFileName);
					}).catch(err => {
						alert("下载音频文件出错");
						console.log("下载音频文件出错", err);
					});
				fileTransfer.onProgress((evt: ProgressEvent) => {
					let progress = window.parseInt(evt.loaded / evt.total * 100);
					console.log(progress)
				})
			})
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


	getFileName(url) {
		let arr = url.split('/');
		let fileName = arr[arr.length - 1];
		return fileName;
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
		if (this.platform.is("ios")) {
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

	play_local_voice(file_url) {
		if (this.mediaRec) {
			this.mediaRec.stop();
			this.mediaRec.release();
		}
		// cordova:旧版路径获取方式
		// function getPhoneGapPath() {
		// 		let path = window.location.pathname;
		// 		path = path.substr(0,path.length - 10 );
		// 		return 'file://' + path;
		// };
		let applicationDirectory = "";//getPhoneGapPath();//window.cordova.file.applicationDirectory;
		let path  =  applicationDirectory + file_url
		this.mediaRec = this.media.create(path);

		this.mediaRec.onSuccess.subscribe(() => {
			console.log("play_local_voice():Audio Success");
		});
		this.mediaRec.onError.subscribe(error => {
			console.log("play_local_voice():Audio Error: ", error);
		});
		
		//开始播放录音
		this.mediaRec.play();
		return false;
	}
}