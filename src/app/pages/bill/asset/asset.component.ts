import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { OnlineAssetService } from '@services/data/asset/asset.service';
import { EmitService } from '@services/emit.service';

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
    amount: null,
    note: ''
  };
  editItem;
  totalAmount = 0;

  constructor(
    private modal: ModalController,
    private service: OnlineAssetService,
    private emit: EmitService
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

  showAssetForm() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.cardTitle = '新增';
    }
  }

  /**
   * 提交修改
   */
  submitAsset() {
    this.showForm = false;
    if (this.cardTitle === '新增' && this.asset.name && this.asset.amount) {
      this.service.createAsset(this.asset).subscribe(ret => {
        if (this.assetList) {
          this.totalAmount += ret.amount;
          this.assetList.push(ret);
        } else {
          this.assetList = [ret];
        }
        this.emit.eventEmit.emit('assetChange');
      });
    }

    if (this.cardTitle === '编辑' && this.editItem) {
      this.service.updateAsset(this.editItem._id, this.asset).subscribe(ret => {
        this.editItem.name = ret.name;
        this.editItem.amount = ret.amount;
        this.editItem.note = ret.note;
        this.emit.eventEmit.emit('assetChange');
      });
    }
  }

  /**
   * 编辑资产
   * @param item
   */
  edit(item) {
    this.editItem = item;
    this.asset.name = this.editItem.name;
    this.asset.amount = this.editItem.amount;
    this.asset.note = this.editItem.notes;
    this.cardTitle = '编辑';
    this.showForm = true;
  }

  /**
   * 删除资产
   * @param item
   */
  delete(item, index) {
    // TODO:
    this.service.deleteAsset(item._id).subscribe(ret => {
      this.totalAmount -= item.amount;
      this.assetList.splice(index, 1);
      this.emit.eventEmit.emit('assetChange');
    });
  }
}
