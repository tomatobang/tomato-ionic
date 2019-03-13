import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import { OnlineTomatoService } from '@services/data.service';

@Component({
  selector: 'cmp-statistics',
  templateUrl: 'statistics.html',
  styleUrls: ['./statistics.scss']
})
export class StatisticsPage implements OnInit {
  dateMulti: string[];
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsMulti: CalendarComponentOptions;

  /**
   * 日期空格大小
   */
  _daysConfig: DayConfig[] = [];

  constructor(
    public tomatoservice: OnlineTomatoService
  ) {
  }

  ngOnInit() {
    for (let i = 0; i < 31; i++) {
      this._daysConfig.push({
        date: new Date(2019, 3, i + 1),
        subTitle: `$${i + 1}`
      })
    }
    this.optionsMulti = {
      pickMode: 'multi',
      daysConfig: this._daysConfig
    };
  }
}
