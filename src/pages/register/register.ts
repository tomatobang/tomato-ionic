/**
 * TODO
 * 1. 微信
 * 3. 手机号
 */

import { Component } from "@angular/core";
import { NavController, IonicPage, ToastController, NavParams } from 'ionic-angular';
import { OnlineUserService, User } from "../../providers/data.service";
import { GlobalService } from "../../providers/global.service";
import { RebirthHttpProvider } from "rebirth-http";
import { JPushService } from '../../_util/jpush.service';


@IonicPage()
@Component({
	selector: "register",
	providers: [OnlineUserService, GlobalService, JPushService],
	templateUrl: "register.html"
})

export class RegisterPage {
	user = new User();
	error = "";
	remeberMe = {
		selected: false
	};

	constructor(
		public service: OnlineUserService,
		public globalservice: GlobalService,
		public rebirthProvider: RebirthHttpProvider,
		public navCtrl: NavController,
		private toastCtrl: ToastController,
		public jPushService: JPushService,
		public navParams: NavParams
	) {
		this.user.username ="";
		this.user.password = "";
		this.user.email = "";
		this.user.displayName = "";
		this.user.confirmPassword = "";
	}

	ngOnInit() {
		console.log("hello `login` component");
		if (this.globalservice.userinfo) {
		}
	}

	public doRegister(): void {
		console.log("doRegister", this.user);

		this.service.register(this.user).subscribe(data => {
			let retOBJ = JSON.parse(data._body);
			let status = retOBJ.status;
			let token = "";
			let userinfo = this.user;
			if (status == "success") {
				token = retOBJ.token;
				userinfo = retOBJ.userinfo;
			} else {
				this.error = "登陆出错！";
				return;
			}
			console.log(data);
			// 这里需要保存 token
			this.globalservice.token = token;
			this.globalservice.userinfo = JSON.stringify(userinfo);
			this.rebirthProvider.headers({ Authorization: token });
			this.jPushService.init(this.user.username);
			this.navCtrl.setRoot("TabsPage");
		});
	}

	public navToLogin(): void {
		// 注册
		this.navCtrl.setRoot("LoginPage");
	}

	presentToast(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 3000,
			position: 'top'
		});

		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});

		toast.present();
	}
}
