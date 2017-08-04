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

	requestPos(to_userid: string) {
		this.socket.emit("request_pos", to_userid);
	}

	postPos(to_userid, pos){
		this.socket.emit("post_pos", to_userid,pos);
	}

	/**
	 * 被要求提交位置
	 */
	submitPos(){
		return this.socket.fromEvent<any>("submit_pos").map(data => data);
	}

	/**
	 * 收到位置信息
	 */
    receivePos() {
		return this.socket.fromEvent<any>("posReceived").map(data => data);
    }
	
	/**
	 * 位置收发错误
	 */
    sendPos_error(){
        return this.socket.fromEvent<any>("sendPos_error").map(data => data);
    }
}
