import { Component, OnInit } from "@angular/core";
import { ElementRef } from "@angular/core";

import { NavController, IonicPage } from "ionic-angular";

import { Platform } from "ionic-angular";
import { Gesture } from "ionic-angular/gestures/gesture";
import { IBeaconService } from "../../../_util/ibeacon.service";

declare var window;

@IonicPage()
@Component({
	selector: "page-iBeacon",
	templateUrl: "iBeacon.html",
	providers: []
})
export class IBeaconPage implements OnInit {
	el: HTMLElement;
	msg: string;
	userid:string;
	constructor(
		public navCtrl: NavController,
		public platform: Platform,
		private elRef: ElementRef,
		private beancon: IBeaconService
	) {
		this.el = elRef.nativeElement;
		platform.ready().then(() => {
			//beancon.init();
		});
	}

	ngOnInit() {
	}
}
