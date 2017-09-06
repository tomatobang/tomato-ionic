import { Component, ViewChild } from "@angular/core";
import { NavController, IonicPage } from "ionic-angular";
@IonicPage()
@Component({
	selector: "page-mine",
	templateUrl: "mine.html"
})
export class MinePage {

	constructor(public navCtrl: NavController) {}

	public ngOnInit(): void {
	
	}

	logout(){
		this.navCtrl.push("LoginPage",null,{},()=>{
		});
	}
}
