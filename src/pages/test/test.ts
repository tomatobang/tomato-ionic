import { Component, OnInit } from "@angular/core";
import { Media, MediaObject } from "@ionic-native/media";
import { ElementRef } from "@angular/core";

import { NavController, IonicPage } from "ionic-angular";

import { Platform } from "ionic-angular";
import { Gesture } from "ionic-angular/gestures/gesture";

import { IBeaconService } from "../../_util/ibeacon.service";
import { SocketIOService } from "../../_util/socket.io.service";

declare var window;

@IonicPage()
@Component({
	selector: "page-test",
	templateUrl: "test.html",
	providers: [Media]
})
export class TestPage implements OnInit {
	el: HTMLElement;
	msg: string;
	constructor(
		public navCtrl: NavController,
		public platform: Platform,
		private elRef: ElementRef,
		private beancon: IBeaconService,
		private chatService: SocketIOService
	) {
		this.el = elRef.nativeElement;
		platform.ready().then(() => {
			//beancon.init();
		});
	}

	ngOnInit() {
		this.chatService.getMessage().subscribe(msg => {
			this.msg = "1st " + msg;
		});


		this.chatService.receivePos().subscribe(msg => {
			this.msg = "1st " + msg;
		});

		this.chatService.sendPos_error().subscribe(msg => {
			this.msg = "1st " + msg;
		});

		this.chatService.submitPos().subscribe(data =>{
			debugger;
			let send_userid = data.send_userid;
	 		this.chatService.postPos(send_userid,"我是位置11111");
		})
	}

	login(userid){
		this.chatService.login(userid);
	}

	sendMsg(msg) {
		//this.chatService.sendMessage(msg);
		this.chatService.requestPos(msg);
	}
}
