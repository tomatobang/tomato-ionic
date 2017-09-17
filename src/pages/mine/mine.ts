import { Component, ViewChild } from "@angular/core";
import { NavController, IonicPage } from "ionic-angular";
import { GlobalService } from "../../providers/global.service";
import { JPushService } from '../../_util/jpush.service';
@IonicPage()
@Component({
	selector: "page-mine",
	templateUrl: "mine.html",
	providers: [JPushService]
})
export class MinePage {
	username: ''

	constructor(public navCtrl: NavController, public globalservice: GlobalService, public jPushService: JPushService) { }

	public ngOnInit(): void {
		this.username = this.globalservice.userinfo.username;
	}

	logout() {
		this.jPushService.clearAlias();
		this.navCtrl.push("LoginPage", null, {}, () => {
		});
		this.globalservice.userinfo="";
	}
}
