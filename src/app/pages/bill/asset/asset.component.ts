import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { addAssetFormComponent } from './addAssetForm/addAssetForm.component';
import { OnlineAssetService } from '@services/data/asset/asset.service';
import { EmitService } from '@services/emit.service';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
})
export class AssetComponent implements OnInit {
  showForm = false;

  assetList;
  editItem;
  totalAmount = 0;

  constructor(
    private modalCtrl: ModalController,
    private service: OnlineAssetService,
    private emitService: EmitService
  ) { }

  ngOnInit() {
    this.loadAssetList();
    this.emitService.getActiveUser().subscribe(ret => {
      this.loadAssetList();
    });
  }

  loadAssetList() {
    this.service.getAssets().subscribe(ret => {
      if (ret) {
        this.totalAmount = 0;
        ret.sort((a, b) => b.amount - a.amount);
        this.assetList = ret;
        for (let index = 0; index < ret.length; index++) {
          const element = ret[index];
          this.totalAmount += element.amount;
        }
      }
    });
  }

  async showAssetForm(type) {
    let modal;
    this.showForm = !this.showForm;
    if (type === '新增') {
      modal = await this.modalCtrl.create({
        component: addAssetFormComponent,
        componentProps: {
          editType: type
        }
      });
    } else {
      modal = await this.modalCtrl.create({
        component: addAssetFormComponent,
        componentProps: {
          editType: '编辑',
          editItem: this.editItem
        }
      });
    }

    modal.onDidDismiss().then(ret => {
      const data = ret.data;
      if (data && data.type === '新增') {
        this.service.createAsset(data.asset).subscribe(ret => {
          if (this.assetList) {
            this.totalAmount += ret.amount;
            this.assetList.push(ret);
          } else {
            this.assetList = [ret];
          }
          this.emitService.eventEmit.emit('assetChange');
        });
      } else if (data && data.type === '编辑') {
        this.service.updateAsset(this.editItem._id, data.asset).subscribe(ret => {
          this.editItem.name = ret.name;
          this.editItem.amount = ret.amount;
          this.editItem.note = ret.note;
          this.emitService.eventEmit.emit('assetChange');
        });
      }
    });
    await modal.present();
  }

  /**
   * 编辑资产
   * @param item
   */
  edit(item) {
    this.editItem = item;
    this.showAssetForm('编辑');
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
      this.emitService.eventEmit.emit('assetChange');
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
