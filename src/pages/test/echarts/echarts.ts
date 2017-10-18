import { Component, OnInit,ViewChild } from "@angular/core";
import { Media, MediaObject } from "@ionic-native/media";
import { ElementRef } from "@angular/core";

import { Platform, IonicPage } from "ionic-angular";
import { Gesture } from "ionic-angular/gestures/gesture";
import * as echarts from "echarts";

declare var window;

@IonicPage()
@Component({
	selector: "page-echarts",
	templateUrl: "echarts.html"
})
export class EchartsPage implements OnInit {
	@ViewChild("divContainer") divContainer;
	

	conversationList = [];
	constructor(
		public platform: Platform,
		private elRef: ElementRef
	) {
	
	}

	ngOnInit() {
		let ec = echarts.init(this.divContainer.nativeElement);
		ec.setOption({
			title: {
				text: "1",
				subtext: "1-1"
			},
			tooltip: {
				trigger: "item",
				formatter: "{a} <br/>{b} : {c} "
			},
			legend: {
				orient: "vertical",
				x: "left",
				data: ["1", "2", "3"]
			},
			toolbox: {
				show: true,
				feature: {
					mark: { show: true },
					dataView: { show: true, readOnly: false },
					magicType: {
						show: true,
						type: ["pie", "funnel"],
						option: {
							funnel: {
								x: "25%",
								width: "50%",
								funnelAlign: "left",
								max: 1548
							}
						}
					},
					restore: { show: true },
					saveAsImage: { show: true }
				}
			},
			series: [
				{
					name: "part",
					type: "pie",
					radius: "55%",
					center: ["50%", "60%"],
					data: [
						{ value: 1, name: "1" },
						{ value: 2, name: "2" },
						{ value: 3, name: "3" }
					]
				}
			]
		});
	}

}