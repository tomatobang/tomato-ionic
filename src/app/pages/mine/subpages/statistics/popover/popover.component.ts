import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { OnlineBillService, OnlineFootprintService, OnlineTodoService } from '@services/data.service';
@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @Input()
  time;
  @Input()
  type;

  billList;
  totalCost = 0;
  totalIncome = 0;

  footprintlist;

  todolist;

  constructor(
    private popover: PopoverController,
    private billService: OnlineBillService,
    private footprintService: OnlineFootprintService,
    private toodoService: OnlineTodoService
  ) { }

  ngOnInit() {
    if (this.time) {
      if (this.type === 'bill') {
        this.loadBillList();
      }
      if (this.type === 'footprint') {
        this.loadFootprintList();
      }
      if (this.type === 'bill') {
        this.loadBillList();
      }
      if (this.type === 'todo') {
        this.loadTodoList();
      }
    }
  }

  /**
   * 账单列表
   */
  loadBillList() {
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

  /**
   * 足迹列表
   */
  loadFootprintList() {
    this.footprintService.getFootprints(this.time).subscribe(ret => {
      if (ret) {
        this.footprintlist = ret;
        this.footprintlist.sort(function (a, b) {
          return new Date(a.create_at) < new Date(b.create_at) ? 1 : -1;
        });
        this.footprintlist.map(val => {
          val.mode = new Array(parseInt(val.mode, 10));
        });
      }
    }, () => {
    });
  }

  /**
 * todo 列表
 */
  loadTodoList() {
    this.toodoService.getTodos(this.time).subscribe(ret => {
      if (ret) {
        this.todolist = ret;
        this.todolist.sort(function (a, b) {
          return new Date(a.create_at) < new Date(b.create_at) ? 1 : -1;
        });
      }
    }, () => {
    });
  }

}
