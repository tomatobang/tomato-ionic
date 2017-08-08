/**
 * Ibeacon 服务
 */
import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { Events } from "ionic-angular";
import { GlobalService } from "../providers/global-service";
import { IBeacon } from "@ionic-native/ibeacon";

declare var window;

@Injectable()
export class IBeaconService {
	constructor(
		public plf: Platform,
		public _global: GlobalService,
		private ibeacon: IBeacon
	) {}

	init() {
		this.ibeacon.requestAlwaysAuthorization();
		// create a new delegate and register it with the native layer
		let delegate = this.ibeacon.Delegate();

		// Subscribe to some of the delegate's event handlers
		delegate
			.didRangeBeaconsInRegion()
			.subscribe(
				data => console.log("didRangeBeaconsInRegion: ", data),
				error => console.error()
			);
		delegate
			.didStartMonitoringForRegion()
			.subscribe(
				data => console.log("didStartMonitoringForRegion: ", data),
				error => console.error()
			);
		delegate.didEnterRegion().subscribe(data => {
			console.log("didEnterRegion: ", data);
		});

		let beaconRegion = this.ibeacon.BeaconRegion(
			"deskBeacon",
			"b9407f30-f5f8466e-aff92555-6b57fe6d"
		);

		this.ibeacon
			.startMonitoringForRegion(beaconRegion)
			.then(
				() =>
					console.log(
						"Native layer recieved the request to monitoring"
					),
				error =>
					console.error(
						"Native layer failed to begin monitoring: ",
						error
					)
			);
	}
}
