import { Component, OnInit, ViewChild } from "@angular/core";
import { Media, MediaObject } from "@ionic-native/media";
import { ElementRef } from "@angular/core";

import { Platform, IonicPage } from "ionic-angular";
import { Gesture } from "ionic-angular/gestures/gesture";
import * as echarts from "echarts";
import { debug } from "util";
import { OnlineTomatoService } from "../../../../providers/data.service";
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
		private elRef: ElementRef,
		public tomatoservice: OnlineTomatoService,
	) {
	}

	cellSize = [45, 45];

	loadData() {
		return new Promise((resolve, reject) => {
			this.tomatoservice.statistics({ isSuccess: 0 }).subscribe(data => {
				debugger
				data = JSON.parse(data._body);
				let ret = [];
				for (let i = 0; i < data.length; i += 1) {
					ret.push([
						data[i]._id, // 日期
						data[i].count // 值
					]);
				}
				resolve(ret);
			}), (err) => {
				reject(err);
			};
		});


	}

	getVirtulData() {
		let date = +echarts.number.parseDate('2017-11-4');
		let end = +echarts.number.parseDate('2017-11-22');
		let dayTime = 3600 * 24 * 1000;
		let data = [];
		for (let time = date; time < end; time += dayTime) {
			data.push([
				echarts.format.formatTime('yyyy-MM-dd', time), // 日期
				Math.floor(Math.random() * 1)  // 值
			]);
		}
		return data;
	}

	ngOnInit() {
		let myChart = echarts.init(this.divContainer.nativeElement);
		// let scatterData = this.getVirtulData();
		this.loadData().then((scatterData) => {
			let option = {
				tooltip: {},
				legend: {
					data: ['完成', '中断'],
					bottom: 20
				},
				calendar: {
					top: 'middle',
					left: 'center',
					orient: 'vertical',
					cellSize: this.cellSize,
					splitLine: {
						lineStyle: {
							color: '#387ef5',
							type: 'dashed',
							opacity: 0.2
						}
					},
					itemStyle: {
						normal: {
							borderWidth: 0
						}
					},
					yearLabel: {
						show: true,
						textStyle: {
							fontSize: 30,
							color: "#387ef5"
						}
					},
					dayLabel: {
						show: false,
						margin: 20,
						firstDay: 1,
						color: '#FF3D00',
						nameMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
					},
					monthLabel: {
						show: false,
						nameMap: 'cn'
					},
					range: ['2017-11']
				},
				series: [{
					id: 'label',
					type: 'scatter',
					coordinateSystem: 'calendar',
					symbol: 'roundRect',
					itemStyle: {
						normal: {
							color: "#FF3D00"
						}
					},
					label: {
						normal: {
							show: true,
							formatter(params) {
								return echarts.format.formatTime('dd', params.value[0]);
							},
							offset: [-this.cellSize[0] / 2 + 8, -this.cellSize[1] / 2 + 8],
							textStyle: {
								color: '#387ef5',//
								fontSize: 12
							}
						}
					},
					markLine: {

					},
					data: scatterData,
					animationEasing: 'bounceInOut',
					animationDelay: function (idx) {
						// 越往后的数据延迟越大
						return idx * 50;
					},
					symbolSize: function (val) {
						return val[1]*3;
					}
				}]
			};

			if (option && typeof option === "object") {
				myChart.setOption(option, true);
			}
		});

	}
}