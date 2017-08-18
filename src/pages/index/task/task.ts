import { Component, OnInit, OnDestroy,ElementRef } from "@angular/core";
import { Media, MediaObject } from "@ionic-native/media";
import { IonicPage,ViewController,Platform } from "ionic-angular";
import { Gesture } from "ionic-angular/gestures/gesture";
import { OnlineTaskService } from "../../../providers/data.service"

declare let window;
@IonicPage()
@Component({
	selector: "cmp-task",
	templateUrl: "task.html",
	providers: [Media]
})
export class TaskPage implements OnInit, OnDestroy {
	allTasks = {
        finished: new Array,
        unfinished: new Array
    };

    newTask = {
        title: '',
        description: '',
        num: 1
    };


	el: HTMLElement;
	pressGesture: Gesture;
	isStartRecord = false;
	recordWait = false;
	isStartedVoice = false;
	mediaRec: MediaObject;
	src = "";
	path = "";
	voice = {
		ImgUrl: "./assets/voice/recog000.png",
		reset() {
			this.ImgUrl = "./assets/voice/recog000.png";
		}
	};


	constructor(
		public taskservice:OnlineTaskService,
		private media: Media,
		public platform: Platform,
        private elRef: ElementRef,
        public viewCtrl: ViewController
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
			this.recordWait = true;
			this.voice.reset();
			this.onRelease();
		});

		this.taskservice.getTasks().subscribe(data => {
            const retStr = data && data._body;
            const dataArr = JSON.parse(retStr);
            this.allTasks.unfinished = dataArr;
            if(dataArr.length > 0 && this.allTasks.unfinished){
                this.allTasks.unfinished = this.allTasks.unfinished.slice();
            }else{
                this.allTasks.unfinished = [];
                this.allTasks.unfinished = this.allTasks.unfinished.slice();
            } 
        }, err => {
            alert(JSON.stringify(err));
            console.log('getTasks err', err);
        })
	}

	ngOnDestroy() {
		this.pressGesture.destroy();
    }
    
    dismiss() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
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
		// 模拟声音大小变化
		let voicechange = setInterval(() => {
			if (!this.recordWait) {
				let i = Math.round(Math.random() * 9);
				this.voice.ImgUrl = "assets/voice/recog00" + i + ".png";
			} else {
				voicechange = undefined;
			}
		}, 400);
		//实例化录音类
		this.mediaRec = this.media.create(this.getNewMediaURL(this.src));
		// fires when file status changes
		this.mediaRec.onStatusUpdate.subscribe(status => console.log(status));
		this.mediaRec.onSuccess.subscribe(() =>
			console.log("audio is successful")
		);
		this.mediaRec.onError.subscribe(error => console.log("Error!", error));
	}

	play(voiFile) {
		this.dismiss();
		if (this.mediaRec) {
			this.mediaRec.stop();
			this.mediaRec.release();
		}
		if (!voiFile) {
			voiFile = this.getNewMediaURL(this.src);
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
		return false;


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
		let counter = 0;
		let timerDur = setInterval(function() {
			counter = counter + 100;
			if (counter > 2000) {
				clearInterval(timerDur);
			}
			let dur = this.mediaRec.getDuration();
			if (dur > 0) {
				clearInterval(timerDur);
				let tmpPath = this.mediaRec.src;
				if (this.platform.is("ios")) {
					tmpPath = this.path + this.src;
				}
				tmpPath = tmpPath.replace("file://", "");
				// 融云发送语音消息示例
				// RongyunUtil.sendVoiceMessage(
				//   conversationType,targetId, tmpPath,dur,this.mediaRec,
				//   function(ret) {
				//     if (ret.status == "prepare") {
				//       appendNewMsg(ret.result.message, true);
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
