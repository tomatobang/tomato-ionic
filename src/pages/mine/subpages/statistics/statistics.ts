import { Component, OnInit, ViewChild } from "@angular/core";
import { Media, MediaObject } from "@ionic-native/media";
import { ElementRef } from "@angular/core";

import { Platform, IonicPage } from "ionic-angular";
import { Gesture } from "ionic-angular/gestures/gesture";
import { init,ECharts}  from "echarts";
declare var window;

@IonicPage()
@Component({
	selector: "page-statistics",
	templateUrl: "statistics.html"
})
export class StatisticsPage implements OnInit {
	@ViewChild("divContainer") divContainer;

	conversationList = [];
	constructor(
		public platform: Platform,
		private elRef: ElementRef
	) {
	}

	ngOnInit() {
		let myChart:ECharts = init(this.divContainer.nativeElement);
		debugger
		let option = {
            visualMap: [{
                show: false,
                min: 0,
                max: 10000
            }],
            calendar: {
                range: '2017'
            },
            series: [{
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data:[]
            }]
        };
		myChart.setOption(option);
	}



}