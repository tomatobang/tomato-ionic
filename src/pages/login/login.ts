/**
 * TODO
 * 1. 微信
 * 2. 账号密码
 * 3. 手机号
 */

import { Component } from "@angular/core";
import { NavController,IonicPage } from 'ionic-angular';
import { OnlineUserService, User } from "../../providers/data.service";
import { GlobalService } from "../../providers/global.service";

import { RebirthHttpProvider } from "rebirth-http";

@IonicPage()
@Component({
	selector: "login",
	providers: [OnlineUserService, GlobalService],
	templateUrl: "login.html"
	//styleUrls: ["./login.component.css"],
	
})
export class LoginPage {
	user = new User();
	error = "";
	remeberMe = {
		selected: false
	};

	constructor(
		public service: OnlineUserService,
		public globalservice: GlobalService,
		public rebirthProvider: RebirthHttpProvider,
		public navCtrl:NavController
	) {}

	ngOnInit() {
		console.log("hello `login` component");
	}

	public doLogin(): void {
		console.log("doLogin", this.user);
		this.navCtrl.push("TabsPage",{},()=>{

		})
		// this.service.login(this.user).subscribe(data => {
		// 	let retOBJ = JSON.parse(data._body);
		// 	let status = retOBJ.status;
		// 	let token = "";
		// 	if (status == "success") {
		// 		token = retOBJ.token;
		// 	} else {
		// 		this.error = "登陆出错！";
		// 		return;
		// 	}
		// 	console.log(data);
		// 	// 这里需要保存 token
		// 	this.globalservice.token = token;
		// 	this.globalservice.userinfo = JSON.stringify(this.user);
		// 	this.rebirthProvider.headers({ Authorization: token });
		// 	// 页面跳转
		// 	//this.router.navigate(['/dash'] , { replaceUrl: true});
		// });
	}

	public doLogout(): void {
		this.globalservice.token = "";
	}

	public navToRegister(): void {
		// 注册
		//this.router.navigate(['/user/register']);
	}
}
