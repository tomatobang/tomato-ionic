import { ModalController, } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-addAssetForm',
  templateUrl: './addAssetForm.component.html',
  styleUrls: ['./addAssetForm.component.scss'],
})
export class addAssetFormComponent implements OnInit {

  @Input()
  editType;

  @Input()
  editItem;

  asset = {
    name: '',
    amount: null,
    note: ''
  };

  constructor(
    private modal: ModalController,
  ) { }

  ngOnInit() {
    if (this.editType === '编辑') {
      this.asset.name = this.editItem.name;
      this.asset.amount = this.editItem.amount;
      this.asset.note = this.editItem.notes;
    }
  }

  close() {
    this.modal.dismiss();
  }

  showAssetForm() {
    this.editType = '新增';
  }

  /**
   * 提交修改
   */
  submitAsset() {
    if (this.editType === '新增' && this.asset.name && this.asset.amount) {
      this.modal.dismiss({
        type: '新增',
        asset: this.asset
      });
    }

    if (this.editType === '编辑' && this.editItem) {
      this.modal.dismiss({
        type: '编辑',
        asset: this.asset
      });
    }
  }

}
