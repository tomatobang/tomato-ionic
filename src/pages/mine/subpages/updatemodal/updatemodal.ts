/*
 * @Author: kobepeng 
 * @Date: 2017-11-25 19:57:50 
 * @Last Modified by: kobepeng
 * @Last Modified time: 2017-11-25 19:59:59
 */
import { Component, OnInit, ViewChild } from "@angular/core";

import { IonicPage, ViewController } from "ionic-angular";
// import { GlobalService } from "../../../../providers/global.service";

declare var window;
@IonicPage()
@Component({
	selector: "page-updatemodal",
	templateUrl: "updatemodal.html"
})
export class UpdatemodalPage implements OnInit {
	page_title: string;
	constructor(
		public viewCtrl: ViewController
		//public globalservice: GlobalService
	) {

	}

	ngOnInit() {
	}

	dismiss() {
		let data = { foo: "bar" };
		this.viewCtrl.dismiss(data);
	}

	save() {

	}
}
