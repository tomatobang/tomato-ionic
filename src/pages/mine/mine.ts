import { Component, ViewChild } from "@angular/core";
import { NavController, IonicPage } from "ionic-angular";
import { GlobalService } from "../../providers/global.service";
@IonicPage()
@Component({
	selector: "page-mine",
	templateUrl: "mine.html"
})
export class MinePage {
	username:''

	constructor(public navCtrl: NavController,public globalservice: GlobalService) {}

	public ngOnInit(): void {
		this.username = this.globalservice.userinfo.username;
	}

	logout(){
		this.navCtrl.push("LoginPage",null,{},()=>{
		});
	}
}
