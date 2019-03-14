import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, Events } from '@ionic/angular';
import { OnlineBillService } from '@services/data/bill/bill.service'

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @Input()
  time;

  billList;
  totalCost = 0;
  totalIncome = 0;

  constructor(
    private popover: PopoverController,
    private evts: Events,
    private billService: OnlineBillService
  ) { }

  ngOnInit() {
    if (this.time) {
      this.billService.getBills(this.time).subscribe(ret => {
        if (ret) {
          this.billList = ret;
          this.totalCost = 0;
          this.totalIncome = 0;
          for (let index = 0; index < ret.length; index++) {
            const element: any = ret[index];
            if (element.type === "支出") {
              this.totalCost += element.amount;
            } else if (element.type === "收入") {
              this.totalIncome += element.amount;
            }
          }
        }
      });
    }
  }

  clearDataAndReset() {
    this.evts.publish('clearDataAndReset');
    this.popover.dismiss();
  }

}
