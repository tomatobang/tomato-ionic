import { Component, OnInit } from "@angular/core";
import { ElementRef } from "@angular/core";

import { NavController, IonicPage } from "ionic-angular";

import { Platform } from "ionic-angular";
import { Gesture } from "ionic-angular/gestures/gesture";

import { DataService } from "../../../providers/data.service";
import { CacheService } from "../../../providers/cache.service";

declare var window;

@IonicPage()
@Component({
	selector: "page-amap",
	templateUrl: "amap.html",
	providers: [DataService,CacheService]
})
export class AMapPage implements OnInit {
	el: HTMLElement;
	map: any;
	constructor(
		public navCtrl: NavController,
		public platform: Platform,
		private elRef: ElementRef,
		private dataService: DataService
	) {
		this.el = elRef.nativeElement;
	}

	ngOnInit() {
		this.loadMap();
	}

	loadMap() {
		//创建地图
		let map = new window.AMap.Map('container', {
			zoom: 4
		});

		//加载相关组件
		window.AMapUI.load(['ui/geo/DistrictCluster', 'lib/$'], (DistrictCluster, $) => {
			window.DistrictCluster = DistrictCluster;
			//启动页面
			let distCluster = new DistrictCluster({
				map: map, //所属的地图实例
				getPosition(item) {
					if (!item) {
						return null;
					}
					let parts = item.split(',');
					//返回经纬度
					return [parseFloat(parts[0]), parseFloat(parts[1])];
				}
			});
			window.distCluster = distCluster;
			//$('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body);
			this.dataService.amapHttpUtil('http://a.amap.com/amap-ui/static/data/10w.txt', {}).subscribe((csv) => {
				//$('#loadingTip').remove();
				let data = csv._body.split('\n');
				distCluster.setData(data);
			});
		});
	}
}
