import { Component, OnInit, ViewChild } from "@angular/core";
import { Media, MediaObject } from "@ionic-native/media";
import { ElementRef } from "@angular/core";

import { Platform, IonicPage } from "ionic-angular";

declare var window;
@IonicPage()
@Component({
	selector: "page-setting",
	templateUrl: "setting.html"
})
export class SettingPage implements OnInit {
	constructor(
		public platform: Platform,
		private elRef: ElementRef
	) {

	}

	ngOnInit() {

	}

}
