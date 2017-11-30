/*
 * @Author: kobepeng 
 * @Date: 2017-11-23 19:26:51 
 * @Last Modified by: kobepeng
 * @Last Modified time: 2017-11-30 13:45:18
 */
import { Subject, Observable } from "rxjs";
import { baseUrl } from '../config'

let subject: Subject<any> = new Subject<any>();
let tokenSubject: Subject<any> = new Subject<any>();
let settingSubject: Subject<any> = new Subject<any>();

export class GlobalService {
	public notificationSubject: Subject<any> = new Subject<any>();
	private _isActive: boolean = false;
	private _isFirstTimeOpen: boolean;
	private _token: string;
	private _userinfo: any;
	private _countdown: number = 0;
	private _resttime: number = 0;
	private _isAlwaysLight: boolean = false;

	serverAddress = baseUrl;

	public get projectChangeMonitor(): Observable<any> {
		return this.notificationSubject.asObservable();
	}
	/**
	 * 配置改变
	 */
	public get settingState(): Observable<any> {
		return settingSubject.asObservable();
	}

	get appIsActive() {
		return this._isActive;
	}

	set appIsActive(value) {
		this._isActive = value;
	}

	get RongyunAppKey() {
		return "lmxuhwagxgt9d";
	}

	public get userinfostate(): Observable<any> {
		return subject.asObservable();
	}

	public get tokenState(): Observable<any> {
		return tokenSubject.asObservable();
	}

	/**
	 * authorization token
	 */
	get token() {
		if (this._token) {
			return this._token;
		} else {
			return localStorage.getItem("token");
		}
	}
	set token(value) {
		this._token = value;
		localStorage.setItem("token", value);
		// this.rebirthHttpProvider.headers({ Authorization: appstate.token });
		tokenSubject.next(value);
	}

	get userinfo() {
		if (this._userinfo) {
			return this._userinfo;
		} else {
			var userStr = localStorage.getItem("userinfo");
			if (userStr) {
				try {
					this._userinfo = JSON.parse(userStr);
					return this._userinfo;
				} catch (error) {
					return null;
				}
			} else {
				return null;
			}
		}
	}

	set userinfo(value: any) {
		if (typeof value == "string") {
			this._userinfo = JSON.parse(value);
			localStorage.setItem("userinfo", value);
		} else if (typeof value == "object") {
			this._userinfo = value;
			localStorage.setItem("userinfo", JSON.stringify(value));
		}

		subject.next(value);
	}

	get isFirstTimeOpen() {
		if (this._isFirstTimeOpen) {
			return this._isFirstTimeOpen;
		} else {
			let isFirstTimeOpen = localStorage.getItem("isFirstTimeOpen");
			if (isFirstTimeOpen == "false") {
				return false;
			} else {
				return true;
			}

		}
	}

	set isFirstTimeOpen(value) {
		this._isFirstTimeOpen = value;
		let str = "";
		if (value) {
			str = "true";
		} else {
			str = "false";
		}
		localStorage.setItem("isFirstTimeOpen", str);
	}

	get isAlwaysLight() {
		if (this._isAlwaysLight) {
			return this._isAlwaysLight;
		} else {
			let isAlwaysLight = localStorage.getItem("isAlwaysLight");
			if (isAlwaysLight == "false") {
				return false;
			} else {
				return true;
			}

		}
	}
	set isAlwaysLight(value: boolean) {
		this._isAlwaysLight = value;
		let str = "";
		if (value) {
			str = "true";
		} else {
			str = "false";
		}
		localStorage.setItem("isAlwaysLight", str);
	}

	/**
	 * 打开通知
	 * @param data 
	 */
	openNotificationCallback(data) {
		this.notificationSubject.next({
			type: "open",
			data: data
		});
	}

	/**
	 * 收到通知
	 * @param data 
	 */
	receiveNotificationCallback(data) {
		this.notificationSubject.next({
			type: "receive",
			data: data
		});
	}

	/**
	 * 设置别名
	 * @param data 
	 */
	setTagsWithAliasCallback(data) {
		this.notificationSubject.next({
			type: "setAlias",
			data: data
		});
	}


	get countdown() {
		if (this._countdown != 0) {
			return this._countdown;
		} else {
			let countdownStr = localStorage.getItem("_countdown");
			if (countdownStr) {
				return parseInt(countdownStr);
			} else {
				return 25;
			}
		}
	}

	set countdown(value: number) {
		this._countdown = value;
		localStorage.setItem("_countdown", value + "");
		settingSubject.next({
			countdown: this._countdown,
			resttime: this._resttime
		});
	}

	get resttime() {
		if (this._resttime != 0) {
			return this._resttime;
		} else {
			let restStr = localStorage.getItem("_resttime");
			if (restStr) {
				return parseInt(restStr);
			} else {
				return 5;
			}
		}
	}

	set resttime(value: number) {
		this._resttime = value;
		localStorage.setItem("_resttime", value + "");
		settingSubject.next({
			countdown: this._countdown,
			resttime: this._resttime
		});
	}

}
