import { Component, OnInit, ViewChild } from '@angular/core';
import { Events } from '@ionic/angular';
import { OnlineTomatoService } from '@services/data.service';
import { GlobalService } from '@services/global.service';
import { TomatoIOService } from '@services/utils/socket.io.service';
import * as echarts from 'echarts';
declare var window;

@Component({
  selector: 'todaylist',
  templateUrl: 'todaylist.html',
  styleUrls: ['./todaylist.scss']
})
export class TodaylistComponent implements OnInit {
  @ViewChild('divContainer') divContainer;
  yearMonth: Date;
  monthlabel: Number;
  yearlabel: Number;
  myChart: any;

  /**
   * 日期空格大小
   */
  cellSize = [45, 45];

  constructor(
    public tomatoIO: TomatoIOService,
    public globalservice: GlobalService,
    public tomatoservice: OnlineTomatoService,
    public events: Events,
  ) {
    console.log('Hello TodaylistComponent Component');
    this.setLabel(0);
  }

  ngOnInit() {
    this.divContainer.nativeElement.style.width = window.screen.width;
    if (window.screen.width < 350) {
      this.divContainer.nativeElement.style.height = window.screen.width + 'px';
    } else {
      this.divContainer.nativeElement.style.height = '350px';
    }
    this.cellSize = [
      (window.screen.width - 10) / 7,
      (window.screen.width - 10) / 7,
    ];
    setTimeout(() => {
      this.myChart = echarts.init(this.divContainer.nativeElement);
      this.refreshData();
    }, 10);

    // let scatterData = this.getVirtulData();
  }



  /**
   * 设置日历标题
   * @param offset 偏移量
   */
  setLabel(offset) {
    if (!this.yearMonth) {
      this.yearMonth = new Date();
    } else {
      const month = this.yearMonth.getMonth() + offset;
      this.yearMonth.setMonth(month);
    }
    this.monthlabel = this.yearMonth.getMonth() + 1;
    this.yearlabel = this.yearMonth.getFullYear();
    this.refreshData();
  }

  /**
   * 加载数据
   */
  loadData(date) {
    return new Promise((resolve, reject) => {
      this.tomatoservice.statistics({ isSuccess: 1, date: date }).subscribe(
        data => {
          const ret = [];
          for (let i = 0; i < data.length; i += 1) {
            ret.push([data[i]._id, data[i].count]);
          }
          resolve(ret);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * 模拟数据
   */
  getVirtulData() {
    const date = +echarts.number.parseDate('2017-11-4');
    const end = +echarts.number.parseDate('2017-11-22');
    const dayTime = 3600 * 24 * 1000;
    const data = [];
    for (let time = date; time < end; time += dayTime) {
      data.push([
        echarts.format.formatTime('yyyy-MM-dd', time),
        Math.floor(Math.random() * 1),
      ]);
    }
    return data;
  }

  /**
   * 数据刷新
   */
  refreshData() {
    this.loadData(this.yearMonth).then((scatterData: any) => {
      let max_count = 0;
      for (let i = 0; i < scatterData.length; i++) {
        if (scatterData[i][1] > max_count) {
          max_count = scatterData[i][1];
        }
      }
      for (let i = 0; i < scatterData.length; i++) {
        const t_data = scatterData[i];
        const value = t_data[1];
        if (max_count !== 0) {
          let color_tmp = value / max_count;
          if (color_tmp < 0.3) {
            color_tmp = 0.3;
          }
          const itemStyle = {
            normal: { color: 'rgba(249,114,113,' + color_tmp + ')' },
          };
          scatterData[i] = {
            value: t_data,
            itemStyle,
          };
        }
      }
      const range =
        this.yearMonth.getFullYear() + '-' + (this.yearMonth.getMonth() + 1);
      const option = {
        tooltip: {
          formatter(dd) {
            return `${dd.value[0]}<br/>番茄钟:${dd.value[1]}`;
          },
        },
        legend: {
          data: ['完成', '中断'],
          bottom: 20,
        },
        calendar: {
          top: 'middle',
          left: 0,
          orient: 'vertical',
          cellSize: this.cellSize,
          splitLine: {
            lineStyle: {
              color: '#8c8c8c',
              type: 'dashed',
              opacity: 0,
            },
          },
          itemStyle: {
            normal: {
              borderWidth: 0,
            },
          },
          yearLabel: {
            show: false,
            textStyle: {
              fontSize: 30,
              color: '#8c8c8c',
            },
          },
          dayLabel: {
            show: true,
            margin: 5,
            firstDay: 1,
            color: '#8c8c8c',
            nameMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          },
          monthLabel: {
            show: false,
            nameMap: 'cn',
          },
          range: range,
        },
        series: [
          {
            id: 'label',
            type: 'scatter',
            coordinateSystem: 'calendar',
            symbol: 'roundRect',
            label: {
              normal: {
                show: true,
                formatter(params) {
                  return echarts.format.formatTime('dd', params.value[0]);
                },
                offset: [-this.cellSize[0] / 2 + 6, -this.cellSize[1] / 2 + 5],
                textStyle: {
                  color: '#8c8c8c',
                  fontSize: 10,
                },
              },
            },
            markLine: {},
            data: scatterData,
            animationEasing: 'bounceInOut',
            animationDelay: function (idx) {
              return idx * 50;
            },
            symbolSize: function (val) {
              return 25;
            },
          },
        ],
      };

      if (option && typeof option === 'object') {
        this.myChart.setOption(option, true);
      }
    });
  }

  /**
   * 上一月
   */
  monthDropleft() {
    this.setLabel(-1);
  }

  /**
   * 下一月
   */
  monthDropright() {
    this.setLabel(1);
  }
}
