import { Component, ViewChild, OnInit, OnDestroy } from "@angular/core";
import {
	NavController,
	ViewController,
	ModalController,
	IonicPage,
	NavParams
} from "ionic-angular";

import {
	OnlineTomatoService,
	OnlineTaskService
} from "../../providers/data.service";
import { Slides } from "ionic-angular";
declare let window;

@IonicPage()
@Component({
	selector: "page-index",
	templateUrl: "index.html"
})
export class IndexPage implements OnInit, OnDestroy {
	page_title = "首页";
	@ViewChild(Slides) slides: Slides;

	// 番茄钟长度
	items = [];
	countdown: number = 25;
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

	historyTomatoes: Array<any> = [];
	tomatoCount = 0;

	constructor(
		public tomatoservice: OnlineTomatoService,
		public navCtrl: NavController,
		public modalCtrl: ModalController
	) {}

	ngOnInit() {
		this.tomatoservice.getTodayTomatos().subscribe(data => {
			let list = JSON.parse(data._body);
			this.historyTomatoes = list;
			this.tomatoCount = list.length;
		});
	}

	ngOnDestroy() {}

	addTask() {
		let profileModal = this.modalCtrl.create("TaskPage");
		profileModal.onDidDismiss(data => {
			console.log(data);
		});
		profileModal.present();
	}

	slideChanged() {
		let currentIndex = this.slides.getActiveIndex();
		console.log("Current index is", currentIndex);
		switch (currentIndex) {
			case 0:this.page_title = "首页";
				break;
			case 1:this.page_title = "今日番茄钟";
				break;
			case 2:this.page_title = "历史查询";
				break;
			default:
				break;
		}
	}
}
