import { Subject, BehaviorSubject, Observable } from "rxjs";

let subject: Subject<any> = new Subject<any>();
let tokenSubject: Subject<any> = new Subject<any>();
export class GlobalService {
	public notificationSubject: Subject<any> = new Subject<any>();
	_isActive: boolean = false;
	_token: string;
	_userinfo: any;
	_countdown: number = 0;
	_resttime: number = 0;

	serverAddress = "http://115.29.51.196:5555";

	public get projectChangeMonitor(): Observable<any> {
		return this.notificationSubject.asObservable();
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

	set userinfo(value) {
		this._userinfo = value;
		localStorage.setItem("userinfo", value);
		subject.next(value);
	}
}
