import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AssetComponent } from './asset/asset.component';
import { GlobalService } from '@services/global.service';
import { RebirthHttpProvider } from 'rebirth-http';
import { OnlineBillService } from '@services/data/bill/bill.service';
import { BillformComponent } from './billform/billform.component';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
})
export class BillPage implements OnInit {
  billList;
  assetList = [];
  totalCost = 0;
  totalIncome = 0;

  constructor(
    private modalCtrl: ModalController,
    private globalservice: GlobalService,
    private rebirthProvider: RebirthHttpProvider,
    private billService: OnlineBillService,
  ) {
    this.rebirthProvider.headers({ Authorization: this.globalservice.token }, true);
  }

  ngOnInit() {
    this.init();
  }

  doRefresh(event) {
    this.init(event.target);
  }

  init(refresher?) {
    this.getBillList(refresher);
  }

  getBillList(refresher?) {
    this.billService.getBills().subscribe(ret => {
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
        if (refresher) {
          refresher.complete();
        }
      }
    });
  }

  async toAssetManagement() {
    const modal = await this.modalCtrl.create({
      component: AssetComponent
    });

    await modal.present();
  }

  async addBill() {
    let modal = await this.modalCtrl.create({
      component: BillformComponent,
      componentProps: {
        edit: false
      }
    });
    modal.onDidDismiss().then(ret => {
      let data = ret.data;
      if (data) {
        if (data.type === '支出') {
          this.totalCost += data.amount;
        } else {
          if (data.type === '收入') {
            this.totalIncome += data.amount;
          }
        }
        this.billList.unshift(data);
      }
    });
    await modal.present();
  }

  async editBill(item) {
    let modal = await this.modalCtrl.create({
      component: BillformComponent,
      componentProps: {
        edit: true,
        item: item
      }
    });
    modal.onDidDismiss().then(ret => {
      // TODO: 直接修改
      if (ret.data) {
        this.init();
      }
    });
    await modal.present();
  }


  deleteBillRecord(item, index) {
    this.billService.deleteBill(item._id).subscribe(ret => {
      if (item.type === '支出') {
        this.totalCost -= ret.amount;
      } else {
        if (item.type === '收入') {
          this.totalIncome -= ret.amount;
        }
      }
      this.billList.splice(index, 1);
    });
  }

}
