import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

import { OnlineBillService } from '@services/data/bill/bill.service';
import { EmitService } from '@services/emit.service';

@Component({
  selector: 'app-asset-bill-info',
  templateUrl: './assetBillInfo.component.html',
  styleUrls: ['./assetBillInfo.component.scss'],
})
export class AssetBillInfoComponent implements OnInit {

  billList = [];
  date = new Date().toISOString();

  @Input()
  asset;

  constructor(
    private modalCtrl: ModalController,
    private billservice: OnlineBillService,
    private emitService: EmitService
  ) { }

  ngOnInit() {
    this.loadAssetList();
    this.emitService.getActiveUser().subscribe(ret => {
      this.loadAssetList();
    });
  }

  loadAssetList() {
    this.billservice.getAssetBills({
      asset: this.asset._id,
      date: this.date
    }).subscribe(ret => {
      if (ret) {
        if (ret.length > 0) {
          this.billList = ret;
          this.date = ret[ret.length - 1].create_at
        }
      }
    });
  }

  loadData(event) {
    this.billservice.getAssetBills({
      asset: this.asset._id,
      date: this.date,
      num: 5
    }).subscribe(ret => {
      if (ret) {
        if (ret.length > 0) {
          this.billList = this.billList.concat(ret);
          this.date = ret[ret.length - 1].create_at
        }

        event.target.complete();
      }
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
