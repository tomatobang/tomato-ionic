/**
 * Ibeacon 服务
 */
import { Injectable } from "@angular/core";
import { IBeacon } from "@ionic-native/ibeacon";

@Injectable()
export class IBeaconService {
	constructor(
		private ibeacon: IBeacon
	) {}

	init() {
		// create a new delegate and register it with the native layer
		let delegate = this.ibeacon.Delegate();

		// 测试 beacon 设备
		let beaconRegion = this.ibeacon.BeaconRegion(
			"estimote",
			"b9407f30-f5f8-466e-aff9-25556b57fe6d",
			null,
			null,
			true
		);

		this.ibeacon.isBluetoothEnabled().then(value => {
			if (!value) {
				alert("蓝牙未打开");
			}
		});

		this.ibeacon.requestAlwaysAuthorization().then(d => {
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
		});

		// Subscribe to some of the delegate's event handlers
		delegate.didRangeBeaconsInRegion().subscribe(
			data => {
				console.log(data.beacons);
				for (var i = 0; i < data.beacons.length; i++) {
					if (
						data.beacons[i].major == 0 &&
						data.beacons[i].minor == 1
					) {
						alert("1")
					} else if (
						data.beacons[i].major == 1 &&
						data.beacons[i].minor == 1
					) {
						alert("2")
					}
				}
				// 成功后即停止扫描
				this.ibeacon
					.stopRangingBeaconsInRegion(beaconRegion)
					.then(d => {});
			},
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
	}
}