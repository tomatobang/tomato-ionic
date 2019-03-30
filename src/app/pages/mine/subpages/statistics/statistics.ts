import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions, DayConfig } from '@components/ion2-calendar';
import { OnlineBillService, OnlineFootprintService, OnlineTodoService } from '@services/data.service';
import { PopoverComponent } from './/popover/popover.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'cmp-statistics',
  templateUrl: 'statistics.html',
  styleUrls: ['./statistics.scss']
})
export class StatisticsPage implements OnInit {
  dateMulti: string[];
  type: 'string';
  optionsMulti: CalendarComponentOptions;
  customActionSheetOptions: any = {
    header: '选择统计类型',
    subHeader: ''
  };

  selectedType = {
    value: 'bill'
  };

  showFinancing = {
    val: true
  };

  total = 0;
  totalCost = 0;
  totalIncome = 0;

  selectedMonth;

  constructor(
    private popover: PopoverController,
    private billService: OnlineBillService,
    private footPrintService: OnlineFootprintService,
    private todoService: OnlineTodoService
  ) {
  }

  triggerTypeChange(evt) {
    const type = evt.detail.value;
    if (this.selectedType.value === type) {
      return;
    } else {
      this.selectedType.value = type;
      switch (type) {
        case 'footprint':
          this.loadFootprintData(new Date());
          break;
        case 'bill':
          this.loadBillData(new Date());
          this.loadMonthData(new Date());
          break;
        case 'todo':
          this.loadTodoData(new Date());
          break;
        default:
          break;
      }
    }
  }

  ngOnInit() {
    this.loadBillData(new Date());
    this.loadMonthData(new Date());
  }

  loadTodoData(date) {
    this.todoService.statistics({
      date: date
    }).subscribe(ret => {
      const completed = ret.completed;
      const imcompleted = ret.imcompleted;
      const result: DayConfig[] = [];
      for (let i = 0; i < completed.length; i++) {
        const completedItem = completed[i];
        for (let j = 0; j < imcompleted.length; j++) {
          const imcompletedItem = imcompleted[j];
          // 同一天
          if (completedItem._id === imcompletedItem._id) {
            result.push({
              date: imcompletedItem._id,
              subTitle: `<div class="day-pay-label">未完</div>${imcompletedItem.count}<div class="day-income-label">完成</div>${completedItem.count}`,
              cssClass: 'date-square-style'
            });
            completedItem.selected = true;
            imcompletedItem.selected = true;
          }
        }
      }

      for (let index = 0; index < imcompleted.length; index++) {
        const element = imcompleted[index];
        if (!element.selected) {
          result.push({
            date: new Date(element._id),
            subTitle: `<div class="day-income-label">未完</div>${element.count}`,
            cssClass: 'date-square-style',
            marked: true
          });
        }
      }

      for (let index = 0; index < completed.length; index++) {
        const element = completed[index];
        if (!element.selected) {
          result.push({
            date: new Date(element._id),
            subTitle: `<div class="day-pay-label">完成</div>${element.count}`,
            cssClass: 'date-square-style'
          });
        }
      }
      this.setOptionMulti(result);
    });
  }

  loadFootprintData(date) {
    this.footPrintService.statistics({
      date: date
    }).subscribe(ret => {
      const result: DayConfig[] = [];
      const data = ret.data;
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        result.push({
          date: item._id,
          subTitle: `<div class="day-pay-label">足迹</div>${item.count}`,
          cssClass: 'date-square-style'
        });
      }
      this.setOptionMulti(result);
    });
  }

  loadBillData(date, excludeTag?) {
    this.billService.statistics({
      date: date,
      type: 'day',
      excludeTag: excludeTag
    }).subscribe(ret => {
      // 合并支出与收入
      const income = ret.income;
      const pay = ret.pay;
      const result: DayConfig[] = [];
      if (income) {
        for (let i = 0; i < income.length; i++) {
          const iItem = income[i];
          for (let j = 0; j < pay.length; j++) {
            const pItem = pay[j];
            // 同一天
            if (iItem._id === pItem._id) {
              result.push({
                date: pItem._id,
                subTitle: `<div class="day-pay-label">支</div>${pItem.total.toFixed(0)}<div class="day-income-label">收</div>${iItem.total.toFixed(0)}`,
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
              subTitle: `<div class="day-income-label">收</div>${element.total.toFixed(2)}`,
              cssClass: 'date-square-style',
              marked: true
            });
          }
        }
      }

      if (pay) {
        for (let index = 0; index < pay.length; index++) {
          const element = pay[index];
          if (!element.selected) {
            result.push({
              date: new Date(element._id),
              subTitle: `<div class="day-pay-label">支</div>${element.total.toFixed(2)}`,
              cssClass: 'date-square-style'
            });
          }
        }
      }

      if (income || pay) {
        this.setOptionMulti(result);
      }

    });
  }

  loadMonthData(date, excludeTag?) {
    this.billService.statistics({
      date: date,
      type: 'month',
      excludeTag: excludeTag
    }).subscribe(ret => {
      this.total = 0;
      this.totalCost = 0;
      this.totalIncome = 0;
      if (ret.income && ret.income.length > 0) {
        this.totalIncome = ret.income[0].total;
      }
      if (ret.pay && ret.pay.length > 0) {
        this.totalCost = ret.pay[0].total;
      }
      this.total = this.totalIncome - this.totalCost;
    });
  }

  setOptionMulti(result) {
    this.optionsMulti = {
      from: new Date(2019, 2, 1),
      to: new Date(),
      pickMode: 'single',
      weekdays: ['天', '一', '二', '三', '四', '五', '六'],
      monthFormat: 'YYYY 年 MM 月 ',
      weekStart: 1,
      daysConfig: result,
      monthPickerFormat: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
  }

  changeMonth($event) {
    this.selectedMonth = $event.newMonth.string;
    this.loadBillData(new Date($event.newMonth.string));
    this.loadMonthData(new Date($event.newMonth.string));
  }

  refreshBillInfo() {
    debugger;
    if (!this.showFinancing.val) {
      if (this.selectedMonth) {
        this.loadBillData(new Date(this.selectedMonth), '理财');
        this.loadMonthData(new Date(this.selectedMonth), '理财');
      } else {
        this.loadBillData(new Date(), '理财');
        this.loadMonthData(new Date(), '理财');
      }
    } else {
      if (this.selectedMonth) {
        this.loadBillData(new Date(this.selectedMonth));
        this.loadMonthData(new Date(this.selectedMonth));
      } else {
        this.loadBillData(new Date());
        this.loadMonthData(new Date());
      }
    }

  }

  async selectDay($event) {
    const datenow = new Date($event.time);
    const dateStr =
      datenow.getFullYear() +
      '-' +
      (datenow.getMonth() + 1) +
      '-' +
      datenow.getDate();
    const popover = await this.popover.create({
      component: PopoverComponent,
      componentProps: {
        time: dateStr,
        type: this.selectedType.value,
      },
      cssClass: 'statistic-popover'
    });
    await popover.present();
  }
}
