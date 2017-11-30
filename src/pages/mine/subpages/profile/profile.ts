import { Component, OnInit, ViewChild } from "@angular/core";
import { IonicPage, ModalController, ViewController, ActionSheetController, Platform } from "ionic-angular";

import { Helper } from '../../../../providers/utils/helper';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { OnlineUserService } from "../../../../providers/data.service";

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';


import { GlobalService } from "../../../../providers/global.service";
import { debug } from "util";

declare var window;
@IonicPage()
@Component({
	selector: "page-profile",
	templateUrl: "profile.html",
	providers: [OnlineUserService, Helper, FileTransfer, File]
})
export class ProfilePage implements OnInit {
	userid = "";
	username: string;
	sex: string;
	email: string;
	displayName: string;
	location: string;
	headImg = "./assets/tomato-active.png";
	constructor(
		public globalservice: GlobalService,
		public modalCtrl: ModalController,
		public actionSheetCtrl: ActionSheetController,
		private camera: Camera,
		private transfer: FileTransfer,
		private file: File,
		private helper: Helper,
		public platform: Platform,
		private userservice: OnlineUserService,
	) { }

	ngOnInit() {
		this.username = this.globalservice.userinfo.username;
		this.email = this.globalservice.userinfo.email;
		this.email = this.email ? this.email : "未知"
		this.sex = this.globalservice.userinfo.sex;
		this.sex = this.sex ? this.sex : "sec"
		this.displayName = this.globalservice.userinfo.displayName;
		this.displayName = this.displayName ? this.displayName : "未知";

		this.location = this.globalservice.userinfo.location;
		this.location = this.location ? this.location : "未知";

		this.username = this.globalservice.userinfo.username;
		this.userid = this.globalservice.userinfo._id;
		if (this.globalservice.userinfo.img) {
			this.platform.ready().then((readySource) => {
				if (readySource == "cordova") {
					this.downloadHeadImg(this.userid, false).then((url) => {
						this.headImg = url;
					});
				} else {
					//this.headImg =this.globalservice.serverAddress + "api/user/headimg/" +this.userid;
				}
			});

		}
	}

	/**
	 * 更新性别
	 */
	changeSex() {
		let profileModal = this.modalCtrl.create("UpdatemodalPage", { update: 'sex',value:this.sex });
		profileModal.onDidDismiss(data => {
			if(!data){
				return;
			}
			this.sex = data.sex;
			this.userservice.updateSex({userid:this.userid,sex:this.sex}).subscribe((data)=>{
				console.log(data);
				this.globalservice.userinfo=JSON.parse(data._body);
			});;
		});
		profileModal.present();
	}

	/**
	 * 更新昵称
	 */
	changeDisplayName() {
		let profileModal = this.modalCtrl.create("UpdatemodalPage", { update: 'displayname',value:this.displayName });
		profileModal.onDidDismiss(data => {
			if(!data){
				return;
			}
			this.displayName = data.displayname;
			this.userservice.updateDisplayName({userid:this.userid,displayname:this.displayName}).subscribe((data)=>{
				this.globalservice.userinfo=JSON.parse(data._body);
			});
			
		});
		profileModal.present();
	}

	/**
	 * 更新邮箱
	 */
	changeEmail() {
		let profileModal = this.modalCtrl.create("UpdatemodalPage", { update: 'email',value:this.email });
		profileModal.onDidDismiss(data => {
			if(!data){
				return;
			}
			this.email = data.email;
			this.userservice.updateEmail({userid:this.userid,email:this.email}).subscribe((data)=>{
				console.log(JSON.parse(data._body));
				debugger
				this.globalservice.userinfo=JSON.parse(data._body);
			});;
		});
		profileModal.present();
	}


	/**
	 * 更新地址
	 */
	changeLocation() {
		let profileModal = this.modalCtrl.create("UpdatemodalPage", { update: 'location',value:this.location });
		profileModal.onDidDismiss(data => {
			if(!data){
				return;
			}
			this.location = data.location;
			this.userservice.updateLocation({userid:this.userid,location:this.location}).subscribe((data)=>{
				console.log(data);
				this.globalservice.userinfo=JSON.parse(data._body);
			});;
		});
		profileModal.present();
	}

	/**
	 * 头像编辑 modal
	 */
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
								userid: this.userid,
								imgData: base64Image
							}).subscribe(ret => {
								this.downloadHeadImg(this.userid, true).then((url) => {
									this.headImg = url + "?" + new Date().getTime();
								});
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
								userid: this.userid,
								imgData: base64Image
							}).subscribe(ret => {
								this.downloadHeadImg(this.userid, true).then((url) => {
									this.headImg = url + "?" + new Date().getTime();
								});
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

	/**
	 * 下载头像
	 * @param filename 
	 * @param change 
	 */
	downloadHeadImg(filename, change): Promise<any> {
		let targetPath = this.helper.getBasePath() + 'headimg/';
		let targetPathWithFileName = this.helper.getBasePath() + 'headimg/' + filename + ".png";

		return new Promise((resolve, reject) => {
			// 检查是否已下载过
			this.file.checkFile(targetPath, filename + ".png").then(
				(success) => {
					if (change) {
						// 先删除本地文件再下载
						this.file.removeFile(targetPath, filename + ".png").then(() => {
							this.filedownload(filename, targetPathWithFileName).then((file) => {
								resolve(file)
							}, (err) => {
								reject(err)
							});
						})
					} else {
						// 直接使用本地文件
						resolve(targetPathWithFileName);
					}
				}, (error) => {
					this.filedownload(filename, targetPathWithFileName).then((file) => {
						resolve(file)
					}, (err) => {
						reject(err)
					});
				});
		})
	}

	/**
	 * 文件下载
	 * @param filename 
	 * @param targetPathWithFileName 
	 */
	filedownload(filename, targetPathWithFileName) {
		return new Promise((resolve, reject) => {
			let options = {
				headers: {
					Authorization: this.globalservice.token
				}
			};
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
		});

	}

}
