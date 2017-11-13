import { Component, OnInit, ViewChild } from "@angular/core";
import { ElementRef } from "@angular/core";

import { IonicPage } from "ionic-angular";
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
	yearMonth: Date;
	monthlabel: Number;
	yearlabel: Number;
	myChart: any;

	constructor(
		private elRef: ElementRef,
		public tomatoservice: OnlineTomatoService,
	) {
		this.setLabel(0);
	}

	setLabel(offset) {
		if (!this.yearMonth) {
			this.yearMonth = new Date();
		} else {
			let month = this.yearMonth.getMonth() +offset;
			this.yearMonth.setMonth(month);
		}
		this.monthlabel = this.yearMonth.getMonth()+1;
		this.yearlabel = this.yearMonth.getFullYear();
		this.refreshData();
	}

	/**
	 * 日期空格大小
	 */
	cellSize = [45, 45];

	/**
	 * 加载数据
	 */
	loadData(date) {
		return new Promise((resolve, reject) => {
			this.tomatoservice.statistics({ isSuccess: 1, date: date }).subscribe(data => {
				data = JSON.parse(data._body);
				let ret = [];
				for (let i = 0; i < data.length; i += 1) {
					ret.push([
						data[i]._id,
						data[i].count
					]);
				}
				resolve(ret);
			}), (err) => {
				reject(err);
			};
		});


	}

	/**
	 * 模拟数据
	 */
	getVirtulData() {
		let date = +echarts.number.parseDate('2017-11-4');
		let end = +echarts.number.parseDate('2017-11-22');
		let dayTime = 3600 * 24 * 1000;
		let data = [];
		for (let time = date; time < end; time += dayTime) {
			data.push([
				echarts.format.formatTime('yyyy-MM-dd', time),
				Math.floor(Math.random() * 1)
			]);
		}
		return data;
	}

	ngOnInit() {
		this.myChart = echarts.init(this.divContainer.nativeElement);
		this.refreshData();
		// let scatterData = this.getVirtulData();
	}

	refreshData() {
		this.loadData(this.yearMonth).then((scatterData) => {
			let option = {
				tooltip: {
					formatter(dd) {
						return dd.data[0] + "<br/>番茄钟:" + dd.data[1];
					}
				},
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
						show: false,
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
					markLine: {},
					data: scatterData,
					animationEasing: 'bounceInOut',
					animationDelay: function (idx) {
						return idx * 50;
					},
					symbolSize: function (val) {
						if (val[1] < 3) {
							return 6;
						}
						if (val[1] < 5) {
							return 8;
						}
						if (val[1] > 10) {
							return 20;
						}
						return val[1] * 2;
					}
				}]
			};

			if (option && typeof option === "object") {
				this.myChart.setOption(option, true);
			}
		});
	}

	monthDropleft() {
		this.setLabel(-1);
	}

	monthDropright() {
		this.setLabel(1);
	}
}