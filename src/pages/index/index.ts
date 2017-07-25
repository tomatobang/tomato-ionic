import { Component, OnInit, OnDestroy } from "@angular/core";
import { Media, MediaObject } from "@ionic-native/media";
import { ElementRef } from "@angular/core";

import { NavController, IonicPage } from "ionic-angular";

import { Platform } from "ionic-angular";
import { Gesture } from "ionic-angular/gestures/gesture";

declare var window;

@IonicPage()
@Component({
	selector: "page-index",
	templateUrl: "index.html",
	providers: [Media]
})
export class IndexPage implements OnInit, OnDestroy {
	el: HTMLElement;
	pressGesture: Gesture;
	isStartRecord = false;
	recordWait = false;
	isStartedVoice = false;
	mediaRec: MediaObject;
	src = "";
	path = "";

	constructor(
		public navCtrl: NavController,
		private media: Media,
		public platform: Platform,
		private elRef: ElementRef
	) {
		if (this.platform.is("IOS")) {
			this.path = window.cordova
				? window.cordova.file.documentsDirectory
				: "";
			this.src = "cordovaIMVoice.wav";
		} else {
			this.path = window.cordova
				? window.cordova.file.externalApplicationStorageDirectory
				: "";
			this.src = "cordovaIMVoice.amr";
		}
		this.el = elRef.nativeElement;
	}

	ngOnInit() {
		this.pressGesture = new Gesture(this.el, { time: 300 });
		this.pressGesture.listen();
		// 长按录音
		this.pressGesture.on("press", e => {
			console.log("press开始了");
			this.onHold();
		});
		// 释放则播放
		this.pressGesture.on("pressup", e => {
			console.log("press结束了");
			this.onRelease();
		});
	}

	ngOnDestroy() {
		this.pressGesture.destroy();
	}

	onHold() {
		this.isStartRecord = true;
		this.recordWait = false;
		try {
			//实例化录音类
			this.startRec();
			//开始录音
			this.mediaRec.startRecord();
			//已经开始
			this.isStartedVoice = true;
			return false;
		} catch (err) {
			console.log(err);
		}
	}
	startRec() {
		if (this.mediaRec) {
			this.mediaRec.release();
		}

		//实例化录音类
		this.mediaRec = this.media.create(this.getNewMediaURL(this.src));
		// fires when file status changes
		this.mediaRec.onStatusUpdate.subscribe(status => console.log(status));
		this.mediaRec.onSuccess.subscribe(() =>
			console.log("audio is successful")
		);
		this.mediaRec.onError.subscribe(error => console.log("Error!", error));

		// 模拟声音大小变化
		// var voicechange = setInterval(function() {
		// 	if (!this.recordWait) {
		// 		var i = Math.round(Math.random() * 9);
		// 		//this.voiceImg.url = "asset/img/chat/voice/recog00" + i + ".png";
		// 	} else {
		// 		voicechange = undefined;
		// 	}
		// }, 400);
	}
	play(voiFile, type) {
		if (this.mediaRec) {
			this.mediaRec.stop();
			this.mediaRec.release();
		}
		// this.elRef.nativeElement.querySelector('div');
		// var target = angular.element(event.target).find("i");
		// if (type == "you") {
		//   target.addClass("web_wechat_voice_gray_playing");
		// } else {
		//   target.addClass("web_wechat_voice_playing");
		// }
		// if (this.platform.is("IOS")) {
		//   voiFile = voiFile.replace("file://", "");
		// }
		// this.mediaRec = this.media.create(voiFile);

		// // 录音执行函数
		// this.mediaRec.onSuccess.subscribe(() => {
		//   //消息属于自己还是好友，前台会传you or me
		//   if (type == "you") {
		//     target.removeClass("web_wechat_voice_gray_playing");
		//   } else {
		//     target.removeClass("web_wechat_voice_playing");
		//   }
		//   console.log("play():Audio Success");
		// });
		// // 录音失败执行函数
		// this.mediaRec.onError.subscribe(error => {
		//   if (type == "you") {
		//     target.removeClass("web_wechat_voice_gray_playing");
		//   } else {
		//     target.removeClass("web_wechat_voice_playing");
		//   }
		//   console.log("play():Audio Error: ", error);
		// });

		// //开始播放录音
		// this.mediaRec.play();
		// return false;
	}

	onRelease() {
		//如果没有开始直接返回
		if (!this.isStartedVoice) {
			return;
		}
		//还原标识
		this.isStartedVoice = false;
		this.recordWait = true;
		setTimeout(() => {
			this.isStartRecord = false;
		}, 1000);
		if (this.mediaRec) {
			this.mediaRec.stopRecord();
			this.mediaRec.release();
		}
		//实例化录音类, src:需要播放的录音的路径
		this.mediaRec = this.media.create(this.getMediaURL(this.src));
		// 录音执行函数
		this.mediaRec.onSuccess.subscribe(() =>
			console.log("touchend():Audio Success")
		);
		// 录音失败执行函数
		this.mediaRec.onError.subscribe(error =>
			console.log("touchend():Audio Error!", error)
		);
		this.mediaRec.play();
		// this.mediaRec.stop();

		//在html中显示当前状态
		var counter = 0;
		var timerDur = setInterval(function() {
			counter = counter + 100;
			if (counter > 2000) {
				clearInterval(timerDur);
			}
			var dur = this.mediaRec.getDuration();
			if (dur > 0) {
				clearInterval(timerDur);
				var tmpPath = this.mediaRec.src;
				if (this.platform.is("ios")) {
					tmpPath = this.path + this.src;
				}
				tmpPath = tmpPath.replace("file://", "");
				// 发送语音消息
				// RongyunUtil.sendVoiceMessage(
				//   $stateParams.conversationType,
				//   $stateParams.targetId,
				//   tmpPath,
				//   dur,
				//   this.mediaRec,
				//   function(ret) {
				//     this.lstResult = "sendVoiceMessage:" + JSON.stringify(ret);
				//     // TODO:消息此时未发送成功，可以加入样式标明；成功后更新样式
				//     if (ret.status == "prepare") {
				//       // ret.result.message在prepare阶段才能读取到
				//       appendNewMsg(ret.result.message, true);
				//     }
				//     // TODO:后续加入发送成功后修改显示样式
				//     if (ret.status == "success") {
				//       viewScroll.scrollBottom(true);
				//     }
				//   }
				// );
			}
		}, 100);

		// 10s 后自动释放
		setTimeout(() => {
			if (this.mediaRec) {
				this.mediaRec.release();
			}
		}, 10000);
		return false;
	}

	getNewMediaURL(s) {
		if (this.platform.is("android")) {
			return this.path + s;
		}
		return "documents://" + s;
	}

	getMediaURL(s) {
		if (this.platform.is("android")) {
			return this.path + s;
		}
		return (this.path + s).replace("file://", "");
	}
}
