import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import { OnlineBillService } from '@services/data.service';

@Component({
  selector: 'cmp-statistics',
  templateUrl: 'statistics.html',
  styleUrls: ['./statistics.scss']
})
export class StatisticsPage implements OnInit {
  dateMulti: string[];
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsMulti: CalendarComponentOptions;


  constructor(
    public billService: OnlineBillService
  ) {
  }

  ngOnInit() {
    this.loadBillData(new Date());
  }

  loadBillData(date) {
    this.billService.statistics({
      date: date
    }).subscribe(ret => {
      // 合并支出与收入
      let income = ret.income;
      let pay = ret.pay;
      let result: DayConfig[] = [];
      for (let i = 0; i < income.length; i++) {
        let iItem = income[i];
        for (let j = 0; j < pay.length; j++) {
          let pItem = pay[j];
          // 同一天
          if (iItem._id === pItem._id) {
            result.push({
              date: pItem._id,
              subTitle: `支${pItem.total.toFixed(0)}收${iItem.total.toFixed(0)}`,
              cssClass: 'date-square-style'
            });
            iItem.selected = true;
            pItem.selected = true;
          }
        }
      }


      for (let index = 0; index < income.length; index++) {
        const element = income[index];
        if (!element.selected) {
          result.push({
            date: new Date(element._id),
            subTitle: `收${element.total}`,
            cssClass: 'date-square-style',
            marked: true
          })
        }

      }

      for (let index = 0; index < pay.length; index++) {
        const element = pay[index];
        if (!element.selected) {
          result.push({
            date: new Date(element._id),
            subTitle: `支${element.total}`,
            cssClass: 'date-square-style'
          })
        }
      }

      this.optionsMulti = {
        from: new Date(2019, 2, 9),
        to: new Date(),
        pickMode: 'multi',
        daysConfig: result,
      };
    });
  }

  changeMonth($event) {
    this.loadBillData(new Date($event.newMonth.string));
  }

  selectDay($event) {
    // debugger;
  }
}
