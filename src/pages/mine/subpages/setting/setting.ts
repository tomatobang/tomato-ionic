import { Component, OnInit, ViewChild } from "@angular/core";

import { IonicPage } from "ionic-angular";
import { GlobalService } from "../../../../providers/global.service";

declare var window;
@IonicPage()
@Component({
	selector: "page-setting",
	templateUrl: "setting.html"
})
export class SettingPage implements OnInit {
	resttime: number;
	countdown: number;
	constructor(
		public globalservice: GlobalService
	) {

	}

	ngOnInit() {
		this.countdown = this.globalservice.countdown;
		this.resttime = this.globalservice.resttime;
	}

	setCountdown(value: number) {
		this.globalservice.countdown = value;
	}

	setResttime(value: number) {
		this.globalservice.resttime = value;
	}

}
