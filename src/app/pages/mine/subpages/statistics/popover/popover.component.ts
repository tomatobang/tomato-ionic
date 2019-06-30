import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { OnlineBillService, OnlineFootprintService, OnlineTodoService } from '@services/data.service';
import { BillformComponent } from '../../../../bill/billform/billform.component';
import { ModalController } from '@ionic/angular';

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
    private modalCtrl: ModalController,
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
      if (this.type === 'todo') {
        this.loadTodoList();
      }
    }
  }

  /**
   * 加载账单
   */
  loadBillList() {
    this.billService.getBills(this.time).subscribe(ret => {
      if (ret) {
        this.billList = ret;
        this.totalCost = 0;
        this.totalIncome = 0;
        for (let index = 0; index < ret.length; index++) {
          const element: any = ret[index];
          if (element.type === '支出' && element.tag !== '资产互转') {
            this.totalCost += element.amount;
          } else if (element.type === '收入' && element.tag !== '资产互转') {
            this.totalIncome += element.amount;
          }
        }
      }
    });
  }

  async editBill(item) {
    const modal = await this.modalCtrl.create({
      component: BillformComponent,
      componentProps: {
        edit: true,
        item: item
      }
    });
    modal.onDidDismiss().then(ret => {
      // TODO: 直接修改
      if (ret.data) {
        this.loadBillList();
      }
    });
    await modal.present();
  }

  /**
   * 加载足迹
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
 * 加载 todo
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
