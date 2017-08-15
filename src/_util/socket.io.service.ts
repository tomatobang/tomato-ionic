import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
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

	postMyPos(to_userid, pos){
		this.socket.emit("post_my_pos", to_userid,pos);
	}

	/**
	 * 被要求提交位置
	 */
	PleasePostPos(){
		return this.socket.fromEvent<any>("please_post_pos").map(data => data);
	}

	/**
	 * 收到位置信息
	 */
    receiveOtherPos() {
		return this.socket.fromEvent<any>("received_other_pos").map(data => data);
    }
	
	/**
	 * 位置收发错误
	 */
    sendPos_error(){
        return this.socket.fromEvent<any>("location_error").map(data => data);
    }
}
