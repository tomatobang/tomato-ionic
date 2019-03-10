import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { OnlineAssetService } from '@services/data/asset/asset.service';


@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
})
export class AssetComponent implements OnInit {
  showForm = false;
  cardTitle = '';

  assetList;

  asset = {
    name: '',
    amount: 0,
    note: ''
  }
  editItem;
  totalAmount = 0;

  constructor(
    private modal: ModalController,
    private service: OnlineAssetService
  ) { }

  ngOnInit() {
    this.loadAssetList();
  }

  close() {
    this.modal.dismiss();
  }

  loadAssetList() {
    this.service.getAssets().subscribe(ret => {
      if (ret) {
        this.totalAmount = 0;
        this.assetList = ret;
        for (let index = 0; index < ret.length; index++) {
          const element = ret[index];
          this.totalAmount += element.amount;
        }
      }
    });
  }

  addAsset() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.cardTitle = '新增';
    }
  }

  submitAsset() {
    this.showForm = false;
    if (this.cardTitle === '新增' && this.asset.name && this.asset.amount) {
      this.service.createAsset(this.asset).subscribe(ret => {
        if (this.addAsset) {
          this.totalAmount += ret.amount;
          this.assetList.push(ret);
        } else {
          this.assetList = [ret];
        }
      });
    }

    if (this.cardTitle === '编辑' && this.editItem) {
      this.service.updateAsset(this.editItem._id, this.asset)
    }
  }

  edit(item) {
    this.editItem = item;
    this.cardTitle = '编辑';
    this.showForm = true;
  }

  delete(item) {
    // TODO:
    this.service.deleteAsset(item._id).subscribe(ret => {
      this.totalAmount -= item.amount;
    });
  }
}
