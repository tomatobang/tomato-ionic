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

	cellSize = [45, 45];
	pieRadius = 12;

	getVirtulData() {
		let date = +echarts.number.parseDate('2017-02-01');
		let end = +echarts.number.parseDate('2017-03-01');
		let dayTime = 3600 * 24 * 1000;
		let data = [];
		for (let time = date; time < end; time += dayTime) {
			data.push([
				echarts.format.formatTime('yyyy-MM-dd', time), // 日期
				Math.floor(Math.random() * 10000)  // 值
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
						position: 'inside',
						fontSize: 12,
						color:"#FF3D00"
					}
				},
				radius: this.pieRadius,
				data: [
					{
						name: '完成',
						itemStyle: {
							normal: {
								color: {
									type: 'radial',
									x: 0.5,
									y: 0.5,
									r: 0.5,
									colorStops: [{
										offset: 0, color: 'red' // 0% 处的颜色
									}, {
										offset: 1, color: 'white' // 100% 处的颜色
									}],
									globalCoord: false // 缺省为 false
								}
							}
						},
						value: Math.round(Math.random() * 24)
					},
					{
						name: '中断',
						itemStyle: {
							normal: {
								color: {
									type: 'radial',
									x: 0.5,
									y: 0.5,
									r: 0.5,
									colorStops: [{
										offset: 0, color: '#4D8CF6' // 0% 处的颜色
									}, {
										offset: 1, color: 'white' // 100% 处的颜色
									}],
									globalCoord: false // 缺省为 false
								}
							}
						},
						value: Math.round(Math.random() * 24)
					}
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
				splitLine :{
					lineStyle :{
							color: '#FF3D00',
							type:'dashed',
							opacity:0.5
					}
				},
				yearLabel: {
					show: false,
					textStyle: {
						fontSize: 30
					}
				},
				dayLabel: {
					margin: 20,
					firstDay: 1,
					color:'#FF3D00',
					nameMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
				},
				monthLabel: {
					show: false,
					nameMap: 'cn'
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
						offset: [-this.cellSize[0] / 2 + 8, -this.cellSize[1] / 2 + 8],
						textStyle: {
							color: '#FF3D00',//
							fontSize: 12
						}
					}
				},
				markLine:{
					
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