import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AssetComponent } from './asset/asset.component';
import { GlobalService } from '@services/global.service';
import { RebirthHttpProvider } from 'rebirth-http';
import { OnlineAssetService } from '@services/data/asset/asset.service';
import { OnlineBillService } from '@services/data/bill/bill.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
})
export class BillPage implements OnInit {
  showAdd = false;
  slideOpts = {
    effect: 'flip'
  };

  newBill = {
    date: new Date(),
    amount: 0,
    asset: '',
    tag: '',
    note: ''
  };
  billList;
  assetList = [];

  constructor(
    private modalCtrl: ModalController,
    private globalservice: GlobalService,
    private rebirthProvider: RebirthHttpProvider,
    private assetService: OnlineAssetService,
    private billService: OnlineBillService
  ) {
    this.rebirthProvider.headers({ Authorization: this.globalservice.token }, true);
  }

  ngOnInit() {
    this.newBill.date = new Date();
    this.initAssetSelect();
    this.getBillList();
  }

  initAssetSelect() {
    this.assetService.getAssets().subscribe(ret => {
      this.assetList = ret;
    });
  }

  getBillList() {
    this.billService.getBills().subscribe(ret => {
      if (ret) {
        this.billList = ret;
      }
    });
  }

  async toAssetManagement() {
    const modal = await this.modalCtrl.create({
      component: AssetComponent
    });

    await modal.present();
  }

  showBillForm() {
    this.showAdd = !this.showAdd;
  }

  /**
   * 新增支付记录
   */
  submitBill() {
    this.showAdd = false;
    this.billService.createBill(this.newBill).subscribe(ret => {
      if (ret) {
        if (this.billList) {
          this.billList.unshift(ret);
        } else {
          this.billList = [ret];
        }
      }
    });
  }

  changePayWay(evt) {
    this.newBill.asset = evt.detail.value;
  }

}
