/*
 * @Author: kobepeng 
 * @Date: 2017-11-25 20:32:32 
 * @Last Modified by:   kobepeng 
 * @Last Modified time: 2017-11-25 20:32:32 
 */
import { Component, ViewChild } from "@angular/core";
import { NavController, ActionSheetController, IonicPage, App, Platform } from "ionic-angular";
import { GlobalService } from "../../providers/global.service";
import { JPushService } from '../../providers/utils/jpush.service';
import { Helper } from '../../providers/utils/helper';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { OnlineUserService } from "../../providers/data.service";

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
	selector: "page-mine",
	templateUrl: "mine.html",
	providers: [JPushService, OnlineUserService, Helper, FileTransfer, File]
})
export class MinePage {
	userid = "";
	username = '';
	headImg = "./assets/tomato-active.png";
	showBigHeadImg = false;

	constructor(public navCtrl: NavController,
		public globalservice: GlobalService,
		public jPushService: JPushService,
		public actionSheetCtrl: ActionSheetController,
		private camera: Camera,
		private transfer: FileTransfer,
		private file: File,
		private helper: Helper,
		public platform: Platform,
		private userservice: OnlineUserService,
		private app: App
	) { }

	public ngOnInit(): void {
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

	logout() {
		this.app.getRootNav().setRoot("LoginPage", {
			username: this.globalservice.userinfo.username,
			password: this.globalservice.userinfo.password
		}, {}, () => {
			this.globalservice.userinfo = "";
			this.globalservice.token = "";
			this.jPushService.clearAlias();
		});

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

	statistics() {
		this.navCtrl.push("StatisticsPage", {
		}, {}, () => { });
	}

	/**
	 * 显示头像大图
	 */
	toShowBigHeadImg() {
		this.showBigHeadImg = true;
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


	/**
	 * 关闭头像大图
	 */
	closeBigHeadImg() {
		this.showBigHeadImg = false;
	}
}
