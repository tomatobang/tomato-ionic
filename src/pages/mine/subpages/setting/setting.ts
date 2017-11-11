import { Component, OnInit, ViewChild } from "@angular/core";

import { IonicPage } from "ionic-angular";
import { GlobalService } from "../../../../providers/global.service";
import { Insomnia } from '@ionic-native/insomnia';

declare var window;
@IonicPage()
@Component({
	selector: "page-setting",
	templateUrl: "setting.html"
})
export class SettingPage implements OnInit {
	resttime: number;
	countdown: number;
	isAlwaysLight: boolean = false;

	longbreakTomatoNum:number;
	IsLoopMode: boolean = false;
	whiteNoiseType:string;
	constructor(
		public globalservice: GlobalService,
		private insomnia: Insomnia
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

	setLongResttimev(value: number){
	}

	changeLightState() {
		if (this.isAlwaysLight) {
			this.insomnia.keepAwake()
				.then(
				() => console.log('success'),
				() => console.log('error')
				);
		} else {
			this.insomnia.allowSleepAgain()
				.then(
				() => console.log('success'),
				() => console.log('error')
				);
		}
	}

	setLongbreakTomatoNum(){

	}

	setLoopMode(){

	}

	setWhiteNoiseType(){

	}
}
