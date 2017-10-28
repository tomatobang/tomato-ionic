/**
 * socket.io 服务
 */

import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Socket } from "ng-socket-io";

@Injectable()
export class SocketIOService {
	constructor(private socket: Socket) {}

	getMessage() {
		return this.socket.fromEvent<any>("msg").map(data => data.msg);
	}

	sendMessage(msg: string) {
		this.socket.emit("msg", msg);
	}

	login(userid: string) {
		this.socket.emit("login_test", userid);
	}

	requestOtherPos(to_userid: string) {
		this.socket.emit("request_other_pos", to_userid);
	}

	postMyPos(to_userid, pos) {
		this.socket.emit("post_my_pos", to_userid, pos);
	}

	/**
	 * 被要求提交位置
	 */
	PleasePostPos() {
		return this.socket.fromEvent<any>("please_post_pos").map(data => data);
	}

	/**
	 * 收到位置信息
	 */
	receiveOtherPos() {
		return this.socket
			.fromEvent<any>("received_other_pos")
			.map(data => data);
	}

	/**
	 * 位置收发错误
	 */
	sendPos_error() {
		return this.socket.fromEvent<any>("location_error").map(data => data);
	}
}



import {Tomato} from "../providers/model_api/tomato"

@Injectable()
export class TomatoIOService {
	constructor(private socket: Socket) {}


	/**
	 * 第一次，用于加载当前tomato
	 */
	load_tomato(userid:string){
		this.socket.emit("load_tomato", {userid,endname:"ionic"},);
	}

	load_tomato_succeed(){
		return this.socket.fromEvent<any>("load_tomato_succeed").map(data => data);
	}

	/**
	 * 其它终端中断番茄钟
	 */
	other_end_break_tomato() {
		return this.socket.fromEvent<any>("other_end_break_tomato").map(data => data);
	}
	/**
	 * 中断番茄钟
	 */
	break_tomato(userid:string,tomato:Tomato) {
		this.socket.emit("break_tomato",{
			userid,endname:"ionic",tomato
		} );
	}

	/**
	 * 中断番茄钟
	 */
	break_tomato_succeed() {
		this.socket.fromEvent<any>("break_tomato_succeed").map(data => data);
	}

	/**
	 * 其它终端开启番茄钟
	 */
	other_end_start_tomato() {
		return this.socket.fromEvent<any>("other_end_start_tomato").map(data => data);
	}

	/**
	 * 开启番茄钟
	 */
	start_tomato(userid:string,tomato:Tomato,countdown:Number) {
		this.socket.emit("start_tomato", {userid,endname:'ionic',tomato,countdown});
	}

	/**
	 * 开启番茄钟成功
	 */
	start_tomato_succeed(tomato:Tomato) {
		this.socket.emit("start_tomato_succeed", tomato);
	}

	/**
	 * 
	 */
	new_tomate_added(){
		return this.socket.fromEvent<any>("new_tomate_added").map(data => data);
	}
}
