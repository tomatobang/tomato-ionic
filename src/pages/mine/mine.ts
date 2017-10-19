import { Component, ViewChild } from "@angular/core";
import { NavController, ActionSheetController, IonicPage } from "ionic-angular";
import { GlobalService } from "../../providers/global.service";
import { JPushService } from '../../_util/jpush.service';
import { Helper } from '../../_util/helper';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { OnlineUserService } from "../../providers/data.service";

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';

@IonicPage()
@Component({
	selector: "page-mine",
	templateUrl: "mine.html",
	providers: [JPushService, OnlineUserService, Helper, FileTransfer, File]
})
export class MinePage {
	username = '';
	headImg = "./assets/tomato-active.png";

	constructor(public navCtrl: NavController,
		public globalservice: GlobalService,
		public jPushService: JPushService,
		public actionSheetCtrl: ActionSheetController,
		private camera: Camera,
		private transfer: FileTransfer,
		private file: File,
		private helper: Helper,
		public platform: Platform,
		private userservice: OnlineUserService, ) { }

	public ngOnInit(): void {
		this.username = this.globalservice.userinfo.username;
		if (this.globalservice.userinfo.img) {
			this.platform.ready().then((readySource) => {
				if (readySource == "cordova") {
					this.downloadHeadImg(this.username).then(() => {
						this.headImg = this.globalservice.serverAddress + this.globalservice.userinfo.img;
					})
				}
			});
			//this.headImg = this.globalservice.serverAddress + this.globalservice.userinfo.img;
		}
	}

	logout() {
		this.navCtrl.push("LoginPage", {
			username: this.globalservice.userinfo.username,
			password: this.globalservice.userinfo.password
		}, {}, () => {
		});
		this.globalservice.userinfo = "";
		this.jPushService.clearAlias();
	}

	setting() {
		console.log("setting!")
		this.navCtrl.push("SettingPage", {
		}, {}, () => { });
	}

	about() {
		console.log("about!")

		this.navCtrl.push("AboutPage", {
		}, {}, () => { });
	}

	profile() {
		this.navCtrl.push("ProfilePage", {
		}, {}, () => { });

	}

	downloadHeadImg(filename): Promise<any> {
		let targetPath = this.helper.getBasePath() + 'headimg/';
		let targetPathWithFileName = this.helper.getBasePath() + 'headimg/' + filename;
		return new Promise((resolve, reject) => {
			// 检查是否已下载过
			this.file.checkFile(targetPath, filename).then(
				(success) => {
					resolve(targetPathWithFileName);
				}, (error) => {
					let options = {};
					let trustHosts = true;
					const fileTransfer: FileTransferObject = this.transfer.create();
					fileTransfer.download(this.globalservice.serverAddress + "api/user/headimg/" + filename,
						targetPathWithFileName, trustHosts,
						options).then(result => {
							console.log("Headmg 下载完成..");
							resolve(result.toURL());
						}).catch(err => {
							reject("Headmg 下载出错");
							console.log("Headmg 下载出错", err);
						});
					fileTransfer.onProgress((evt: ProgressEvent) => {
						console.log(evt)
					})
				})
		})
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
							}).subscribe(ret => {
								this.downloadHeadImg(this.username);
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
							}).subscribe(ret => {
								this.downloadHeadImg(this.username);
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
