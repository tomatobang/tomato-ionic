import { Component, OnInit, ViewChild } from "@angular/core";
import { Media, MediaObject } from "@ionic-native/media";
import { ElementRef } from "@angular/core";

import { Platform, IonicPage } from "ionic-angular";
import { Gesture } from "ionic-angular/gestures/gesture";
import * as echarts from "echarts";
import { debug } from "util";
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

	cellSize = [50, 50];
	pieRadius = 15;

	getVirtulData() {
		let date = +echarts.number.parseDate('2017-02-01');
		let end = +echarts.number.parseDate('2017-03-01');
		let dayTime = 3600 * 24 * 1000;
		let data = [];
		for (let time = date; time < end; time += dayTime) {
			data.push([
				echarts.format.formatTime('yyyy-MM-dd', time),
				Math.floor(Math.random() * 10000)
			]);
		}
		return data;
	}

	getPieSeries(scatterData, chart) {
		return echarts.util.map(scatterData, (item, index) => {
			let center = chart.convertToPixel('calendar', item);
			return {
				id: index + 'pie',
				type: 'pie',
				center: center,
				label: {
					normal: {
						formatter: '{c}',
						position: 'inside'
					}
				},
				radius: this.pieRadius,
				data: [
					{ name: '完成', value: Math.round(Math.random() * 24) },
					{ name: '中断', value: Math.round(Math.random() * 24) }
				]
			};
		});
	}

	getPieSeriesUpdate(scatterData, chart) {
		return echarts.util.map(scatterData, (item, index) => {
			let center = chart.convertToPixel('calendar', item);
			return {
				id: index + 'pie',
				center: center
			};
		});
	}

	ngOnInit() {
		let myChart = echarts.init(this.divContainer.nativeElement);
		let scatterData = this.getVirtulData();
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
				yearLabel: {
					show: false,
					textStyle: {
						fontSize: 30
					}
				},
				dayLabel: {
					margin: 20,
					firstDay: 1,
					nameMap: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
				},
				monthLabel: {
					show: false
				},
				range: ['2017-02']
			},
			series: [{
				id: 'label',
				type: 'scatter',
				coordinateSystem: 'calendar',
				symbolSize: 1,
				label: {
					normal: {
						show: true,
						formatter(params) {
							return echarts.format.formatTime('dd', params.value[0]);
						},
						offset: [-this.cellSize[0] / 2 + 10, -this.cellSize[1] / 2 + 10],
						textStyle: {
							color: '#000',
							fontSize: 14
						}
					}
				},
				data: scatterData
			}]
		};

		if (!window.inNode) {
			let pieInitialized;
			setTimeout(() => {
				pieInitialized = true;
				let series = this.getPieSeries(scatterData, myChart);
				myChart.setOption({
					series: series
				});
			}, 10);

			window.onresize = function () {
				if (pieInitialized) {
					myChart.setOption({
						series: this.getPieSeriesUpdate(scatterData, myChart)
					});
				}
			};
		}
		if (option && typeof option === "object") {
			myChart.setOption(option, true);
		}
	}
}