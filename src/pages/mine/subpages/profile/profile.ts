import { Component, OnInit, ViewChild } from "@angular/core";
import { IonicPage } from "ionic-angular";

import { GlobalService } from "../../../../providers/global.service";

declare var window;
@IonicPage()
@Component({
	selector: "page-profile",
	templateUrl: "profile.html"
})
export class ProfilePage implements OnInit {
	username: string;
	constructor(
		public globalservice: GlobalService
		

	) { }

	ngOnInit() {
		this.username = this.globalservice.userinfo.username;
	}

	

}
