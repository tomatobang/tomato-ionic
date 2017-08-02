import { Component, OnInit } from "@angular/core";
import { Media, MediaObject } from "@ionic-native/media";
import { ElementRef } from "@angular/core";

import { NavController, IonicPage } from "ionic-angular";

import { Platform } from "ionic-angular";
import { Gesture } from "ionic-angular/gestures/gesture";

declare var window;

@IonicPage()
@Component({
	selector: "page-test",
	templateUrl: "test.html",
	providers: [Media]
})
export class TestPage implements OnInit {
	el: HTMLElement;

	constructor(
		public navCtrl: NavController,
		public platform: Platform,
		private elRef: ElementRef
	) {
		
		this.el = elRef.nativeElement;
	}

	ngOnInit() {
	
	}
}
