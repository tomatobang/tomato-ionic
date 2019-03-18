import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions, DayConfig } from '@components/ion2-calendar';
import { OnlineBillService, OnlineFootprintService } from '@services/data.service';
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
  }

  constructor(
    private popover: PopoverController,
    public billService: OnlineBillService,
    public footPrintService: OnlineFootprintService
  ) {
  }

  triggerTypeChange(evt) {
    let type = evt.detail.value;
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
          break;
        case 'todo':
          alert('TODO');
          break;
        default:
          break;
      }
    }
  }

  ngOnInit() {
    this.loadBillData(new Date());
  }

  loadFootprintData(date) {
    this.footPrintService.statistics({
      date: date
    }).subscribe(ret => {
      let result: DayConfig[] = [];
      let data = ret.data;
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        result.push({
          date: item._id,
          subTitle: `<div class="day-pay-label">足迹</div>${item.count}`,
          cssClass: 'date-square-style'
        });
      }

      this.optionsMulti = {
        from: new Date(2019, 2, 1),
        to: new Date(),
        pickMode: 'single',
        daysConfig: result,
      };
    });
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
          })
        }
      }

      for (let index = 0; index < pay.length; index++) {
        const element = pay[index];
        if (!element.selected) {
          result.push({
            date: new Date(element._id),
            subTitle: `<div class="day-pay-label">支</div>${element.total.toFixed(2)}`,
            cssClass: 'date-square-style'
          })
        }
      }

      this.optionsMulti = {
        from: new Date(2019, 2, 9),
        to: new Date(),
        pickMode: 'single',
        daysConfig: result,
      };
    });
  }

  changeMonth($event) {
    this.loadBillData(new Date($event.newMonth.string));
  }

  async selectDay($event) {
    let datenow = new Date($event.time);
    const dateStr =
      datenow.getFullYear() +
      '-' +
      (datenow.getMonth() + 1) +
      '-' +
      datenow.getDate();
    let popover = await this.popover.create({
      component: PopoverComponent,
      componentProps: {
        time: dateStr,
        type: this.selectedType.value
      }
    });
    await popover.present();
  }
}
