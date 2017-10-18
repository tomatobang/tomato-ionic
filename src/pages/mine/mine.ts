import { Component, ViewChild } from "@angular/core";
import { NavController, ActionSheetController,IonicPage } from "ionic-angular";
import { GlobalService } from "../../providers/global.service";
import { JPushService } from '../../_util/jpush.service';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { OnlineUserService } from "../../providers/data.service";

@IonicPage()
@Component({
	selector: "page-mine",
	templateUrl: "mine.html",
	providers: [JPushService,OnlineUserService]
})
export class MinePage {
	username='';
	headImg="./assets/tomato-active.png";

	constructor(public navCtrl: NavController, public globalservice: GlobalService, public jPushService: JPushService,public actionSheetCtrl: ActionSheetController,
		private camera: Camera,
		private userservice: OnlineUserService,) { }

	public ngOnInit(): void {
		this.username = this.globalservice.userinfo.username;
		if(this.globalservice.userinfo.img){
			this.headImg = this.globalservice.serverAddress+ this.globalservice.userinfo.img;
		}
	}

	logout() {
		this.navCtrl.push("LoginPage", {
			username: this.globalservice.userinfo.username,
			password: this.globalservice.userinfo.password
		}, {
			}, () => {
			});
		this.globalservice.userinfo = "";
		this.jPushService.clearAlias();
	}

	setting() {
		console.log("setting!")

		this.navCtrl.push("SettingPage", {
		}, {
			}, () => {
			});
	}

	about() {
		console.log("about!")

		this.navCtrl.push("AboutPage", {
		}, {}, () => {});
	}

	profile() {
		this.navCtrl.push("ProfilePage", {
		}, {}, () => {});

	}

	changeHeadImg() {
		let actionSheet = this.actionSheetCtrl.create({
			title: '修改头像',
			buttons: [
				{
					text: '从相册中选择',
					handler: () => {
						console.log('从相册中选择 clicked');
						const options: CameraOptions = {
							quality: 100,
							sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
							destinationType: this.camera.DestinationType.DATA_URL,
							encodingType: this.camera.EncodingType.PNG,
							mediaType: this.camera.MediaType.PICTURE,
							targetWidth: 180,
							targetHeight: 180
						}

						this.camera.getPicture(options).then((imageData) => {
							// imageData is either a base64 encoded string or a file URI
							// If it's base64:
							let base64Image = 'data:image/jpeg;base64,' + imageData;
							this.userservice.updateUserHeadImg({
								userid: this.username,
								imgData: base64Image
							});
						}, (err) => {
							// Handle error
						});
					}
				}, {
					text: '拍摄照片',
					handler: () => {
						console.log('拍摄照片 clicked');
						const options: CameraOptions = {
							quality: 100,
							sourceType: this.camera.PictureSourceType.CAMERA,
							destinationType: this.camera.DestinationType.DATA_URL,
							encodingType: this.camera.EncodingType.PNG,
							mediaType: this.camera.MediaType.PICTURE,
							targetWidth: 180,
							targetHeight: 180
						}

						this.camera.getPicture(options).then((imageData) => {
							// imageData is either a base64 encoded string or a file URI
							// If it's base64:
							let base64Image = 'data:image/jpeg;base64,' + imageData;
							this.userservice.updateUserHeadImg({
								userid: this.username,
								imgData: base64Image
							});
						}, (err) => {
							// Handle error
						});
					}
				}, {
					text: '取消',
					role: 'cancel',
					handler: () => {
						console.log('Cancel 修改头像');
					}
				}
			]
		});
		actionSheet.present();
	}
}
