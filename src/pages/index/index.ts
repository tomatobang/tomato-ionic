import { Component, ViewChild, OnInit, OnDestroy } from "@angular/core";
import {
	NavController,
	ViewController,
	ModalController,
	IonicPage,
	NavParams
} from "ionic-angular";
import { AngularRoundProgressComponent } from "../../_directives/angular-round-progress-directive";

import {
	OnlineTomatoService,
	OnlineTaskService
} from "../../providers/data.service";
import { GlobalService } from "../../providers/global.service";
import { TomatoIOService } from '../../_util/socket.io.service';

import { Slides } from "ionic-angular";
declare let window;

@IonicPage()
@Component({
	selector: "page-index",
	templateUrl: "index.html"
})
export class IndexPage implements OnInit, OnDestroy {
	page_title = "首页";
	_userid:string;
	@ViewChild(Slides) slides: Slides;

	// 番茄钟长度
	items = [];

	historyTomatoes: Array<any> = [];
	tomatoCount = 0;

	constructor(
		public globalservice:GlobalService,
		public tomatoservice: OnlineTomatoService,
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public tomatoIO:TomatoIOService
	) {}

	ngOnInit() {
		this.tomatoservice.getTodayTomatos().subscribe(data => {
			let list = JSON.parse(data._body);
			this.historyTomatoes = list;
			this.tomatoCount = list.length;
		});

		// 加载正在进行的番茄钟
		this._userid = this.globalservice.userinfo.userid;
		this.tomatoIO.load_tomato(this._userid);
		this.tomatoIO.load_tomato_succeed().subscribe(t=>{
			debugger;
			if (t && t!="null"){
				this.startTask(t);
			}
		});
		// 其它终端开启
		this.tomatoIO.other_end_start_tomato().subscribe(t=>{
			if (t && t!="null"){
				this.startTask(t);
			}
		});
		// 其它终端中断
		this.tomatoIO.other_end_break_tomato().subscribe(data=>{

		});

		this.mp3Source.setAttribute("src", "/assets/audios/alert.mp3");
		this.oggSource.setAttribute("src", "/assets/audios/alert.ogg");
		this.alertAudio.appendChild(this.mp3Source);
		this.alertAudio.appendChild(this.oggSource);
		this.alertAudio.load();
	}

	ngOnDestroy() {}

	addTask() {
		let profileModal = this.modalCtrl.create("TaskPage");
		profileModal.onDidDismiss(data => {
			if (data.task){
				console.log(data.task);
				this.startTask(data.task);
			} 
		});
		profileModal.present();
	}

	slideChanged() {
		let currentIndex = this.slides.getActiveIndex();
		console.log("Current index is", currentIndex);
		switch (currentIndex) {
			case 0:
				this.page_title = "首页";
				break;
			case 1:
				this.page_title = "今日番茄钟";
				break;
			case 2:
				this.page_title = "历史查询";
				break;
			default:
				break;
		}
	}

	mp3Source: HTMLSourceElement = document.createElement("source");
	oggSource: HTMLSourceElement = document.createElement("source");
	alertAudio: HTMLAudioElement = document.createElement("audio");
	// 番茄钟长度
	countdown: number = 25;
	// 休息时间长度
	resttime: number = 5;
	mytimeout: any = null;
	activeTomato: any = null;
	isResting: boolean = false;
	resttimeout: any = null;
	resttimestart: any = null;
	timerStatus = {
		label: this.countdown + ":00",
		countdown: this.countdown,
		percentage: 0,
		count: 0,
		reset: function() {
			this.count = 0;
			this.percentage = 0;
			this.label = this.countdown + ":00";
		}
	};
	@ViewChild(AngularRoundProgressComponent)
	child: AngularRoundProgressComponent;
	ngAfterViewInit() {
		setInterval(() => {
			this.child.timerStatusValue == this.timerStatus;
			this.child.render();
		}, 1000);
	}
	startTask(task: any) {
		this.activeTomato = task;
		// 开启番茄钟
		this.tomatoIO.start_tomato(this._userid,task);
		this.activeTomato.startTime = new Date();
		this.startTimer();
		let that = this;
	}

	startTimer() {
		this.isResting = false;
		if (typeof this.mytimeout !== "undefined") {
			clearTimeout(this.mytimeout);
			this.timerStatus.reset();
		}
		this.mytimeout = setTimeout(this.onTimeout.bind(this), 1000);
	}

	onTimeout() {
		let datenow: number = new Date().getTime();
		let startTime: number = this.activeTomato.startTime.getTime();
		let dataspan: number = datenow - startTime;

		let secondspan: number = dataspan / 1000;
		let percentage = dataspan / (this.countdown * 60 * 1000);

		this.timerStatus.percentage = percentage;
		this.timerStatus.label = this.secondsToMMSS(
			this.countdown * 60 - parseInt(secondspan + "")
		);
		// 倒计时结束
		if (dataspan >= this.countdown * 60 * 1000) {
			this.alertAudio.play();
		} else {
			this.mytimeout = setTimeout(this.onTimeout.bind(this), 1000);
		}
	}

	onRestTimeout() {
		let datenow: number = new Date().getTime();
		let startTime: number = this.resttimestart.getTime();
		let dataspan: number = datenow - startTime;

		let secondspan: number = dataspan / 1000;
		let percentage = dataspan / (this.resttime * 60 * 1000);

		this.timerStatus.percentage = percentage;
		this.timerStatus.label = this.secondsToMMSS(
			this.resttime * 60 - parseInt(secondspan + "")
		);

		if (dataspan >= this.resttime * 60 * 1000) {
			this.alertAudio.play();
			this.isResting = false;
			this.timerStatus.reset();
		} else {
			this.resttimeout = setTimeout(this.onRestTimeout.bind(this), 1000);
		}
	}

	stopTimer() {
		clearTimeout(this.mytimeout);
		this.timerStatus.reset();
	}

	secondsToMMSS(timeInSeconds: number) {
		let minutes = Math.floor(timeInSeconds / 60);
		let seconds = timeInSeconds - minutes * 60;
		let retStr: string = "";
		if (minutes < 10) {
			retStr += "0" + minutes;
		} else {
			retStr += minutes;
		}
		retStr += ":";
		if (seconds < 10) {
			retStr += "0" + seconds;
		} else {
			retStr += seconds;
		}
		return retStr;
	}
}
