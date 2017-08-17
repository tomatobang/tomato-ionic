import { Component, OnInit, OnDestroy } from "@angular/core";
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
declare let window;

@IonicPage()
@Component({
	selector: "page-index",
	templateUrl: "index.html"
})
export class IndexPage implements OnInit, OnDestroy {
	// 番茄钟长度
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
			debugger
			console.log(data);
		});
		profileModal.present();
	}
}
