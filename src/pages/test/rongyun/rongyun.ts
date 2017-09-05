import { Component, OnInit } from "@angular/core";
import { Media, MediaObject } from "@ionic-native/media";
import { ElementRef } from "@angular/core";

import { NavController, IonicPage } from "ionic-angular";

import { Platform } from "ionic-angular";
import { Gesture } from "ionic-angular/gestures/gesture";

import { RongYunService } from "../../../_util/rongyun.service";

declare var window;

@IonicPage()
@Component({
	selector: "page-rongyun",
	templateUrl: "rongyun.html"
})
export class RongyunPage implements OnInit {
	el: HTMLElement;
	msg: string;
	tokenlist = {
		'py':"YNWj/xR0fs/Ag4TimR3In1DK05mPvGO+YvYGisV+tPxkqSG/XsejJi90arsJEc72scG8jChX6tTyUlqZzpcL0Q==",
		'ws':"/tQB1Hwa0BdIIynQGtrY61DK05mPvGO+YvYGisV+tPxkqSG/XsejJteMgFwQzuHPACFqXt9/fHfyUlqZzpcL0Q=="
	};
	useridList = {
		'py':"384",
		'ws':"385"
	}
	token:string;
	t:any;

	conversationList = [];
	constructor(
		public navCtrl: NavController,
		public platform: Platform,
		private elRef: ElementRef,
		private rongyunservice:RongYunService
	) {
		this.el = elRef.nativeElement;
		platform.ready().then(() => {
		});
	}

	ngOnInit() {
	
	}

	login(t){
		this.t = t;
		if(t == 1){
			this.token = this.tokenlist["ws"];
		}else{
			this.token = this.tokenlist["py"];
		}
	}

	init(){
		this.rongyunservice._init(this.token,(d =>{
			alert("连接成功！")
		}));
		this.rongyunservice._getConversationList((ret)=>{
			this.conversationList =  ret.result;
			console.log(ret);
		},"chat")

	}

	sendMsg(msg) {
		if(this.t == 1){
			this.rongyunservice._sendMessage("PRIVATE",'384',msg,(d)=>{
				alert("你好，py,发送成功！")
			})
		}else{
			this.rongyunservice._sendMessage("PRIVATE",'385',msg,(d)=>{
				alert("你好，ws,发送成功！")
			})
		}
	
	}
}
