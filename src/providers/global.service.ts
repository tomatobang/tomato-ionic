import { Subject, BehaviorSubject, Observable } from "rxjs";

export class GlobalService {
	public notificationSubject: Subject<any> = new Subject<any>();
	_isActive: boolean = false;

	public get projectChangeMonitor(): Observable<any> {
		return this.notificationSubject.asObservable();
	}

	openNotificationCallback(data) {
		this.notificationSubject.next({
			type: "open",
			data: data
		});
	}

	receiveNotificationCallback(data) {
		this.notificationSubject.next({
			type: "receive",
			data: data
		});
	}

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
		return "";
	}
}
