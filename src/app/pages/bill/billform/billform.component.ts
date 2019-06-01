import { ToastController, ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { OnlineAssetService } from '@services/data/asset/asset.service';
import { OnlineBillService } from '@services/data/bill/bill.service';
import { OnlineTagService } from '@services/data/tag/tag.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-billform',
  templateUrl: './billform.component.html',
  styleUrls: ['./billform.component.scss'],
})
export class BillformComponent implements OnInit {
  @Input()
  edit;

  @Input()
  item;

  slideOpts = {
    effect: 'flip'
  };
  isSubmiting = false;

  title = '';

  newBill = {
    _id: '',
    date: new Date().toISOString(),
    amount: null,
    asset: '',
    tag: '',
    note: '',
    type: '支出'
  };

  assetExchange = {
    date: new Date().toISOString(),
    amount: null,
    note: '',
    fromAsset: '',
    toAsset: '',
  };

  assetList = [];
  tag = [];
  payTags = [];
  incomeTags = [];
  dateStr;

  constructor(
    private modalCtrl: ModalController,
    private assetService: OnlineAssetService,
    private tagService: OnlineTagService,
    private billService: OnlineBillService,
    private toastCtrl: ToastController,
  ) {
  }

  ngOnInit() {
    if (this.edit) {
      this.newBill = {
        _id: this.item._id,
        date: new Date(this.item.create_at).toISOString(),
        amount: this.item.amount,
        asset: this.item.asset._id,
        tag: this.item.tag.split(','),
        note: this.item.note,
        type: this.item.type
      };
      this.title = '编辑账单';
    } else {
      this.title = '新增账单';
      this.newBill.date = new Date().toISOString();
      this.assetExchange.date = new Date().toISOString();
    }

    this.initAssetSelect();
    this.initTags();
  }

  initTags() {
    let requestPaytag = this.tagService.getTags(2);
    let requestIncometag = this.tagService.getTags(3);
    forkJoin([requestPaytag, requestIncometag])
      .subscribe((data: any) => {
        this.payTags = data[0];
        this.incomeTags = data[1];
        this.payTags.sort((a, b) => a.sort - b.sort);
        this.incomeTags.sort((a, b) => a.sort - b.sort);
        this.initSelectedTag(this.newBill.tag, this.newBill.type);
      });
  }

  initSelectedTag(tags, type) {
    if (tags && tags.length > 0) {
      this.tag = [];
      for (let index = 0; index < tags.length; index++) {
        const tag = tags[index];
        if (type === '支出') {
          for (let index = 0; index < this.payTags.length; index++) {
            const pagTag = this.payTags[index];
            if (tag === pagTag.name) {
              pagTag.selected = true;
              this.tag.push(pagTag.name);
            }
          }

        } else if (type === '收入') {
          for (let index = 0; index < this.incomeTags.length; index++) {
            const incomeTag = this.incomeTags[index];
            if (tag === incomeTag.name) {
              incomeTag.selected = true;
              this.tag.push(incomeTag.name);
            }
          }
        }
      }
    }
  }

  initAssetSelect() {
    this.assetService.getAssets().subscribe(ret => {
      this.assetList = ret;
      if (this.assetList && this.assetList.length > 0) {
        if (this.newBill._id) {
          for (let index = 0; index < this.assetList.length; index++) {
            const element = this.assetList[index];
            if (element._id === this.newBill.asset) {
              this.newBill.asset = element._id;
              return;
            }
          }
        } else {
          this.newBill.asset = this.assetList[0]._id;
        }
      }
    });
  }

  async submit() {
    if (!this.isSubmiting) {
      if (this.newBill.type !== "资产互转") {
        this.createOrUpdateBill();
      } else {
        this.submitAssetExchange();
      }
    }
  }

  sleep(second) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(' enough sleep~');
      }, second);
    })
  }

  async submitAssetExchange() {
    if (!this.assetExchange.amount) {
      const toast = await this.toastCtrl.create({
        message: '请输入金额',
        duration: 2500
      });
      await toast.present();
      return;
    }

    if (!this.assetExchange.fromAsset || !this.assetExchange.toAsset) {
      const toast = await this.toastCtrl.create({
        message: '请选择转换资产',
        duration: 2500
      });
      await toast.present();
      return;
    }
    // adjust bill exchange date
    this.isSubmiting = true;
    this.assetExchange.date = new Date(this.assetExchange.date).toISOString();
    this.billService.billexchange(this.assetExchange).subscribe(ret => {
      this.newBill.type = '支出';
      this.assetExchange = {
        date: new Date().toISOString(),
        amount: null,
        note: '',
        fromAsset: '',
        toAsset: '',
      };
      this.modalCtrl.dismiss({
        tag: '资产互转'
      });
    }, () => {
      this.isSubmiting = false;
    }, () => { });

  }

  async createOrUpdateBill() {
    if (!this.newBill.amount) {
      const toast = await this.toastCtrl.create({
        message: '请输入金额',
        duration: 2500
      });
      await toast.present();
      return;
    }

    if (!this.newBill.asset) {
      const toast = await this.toastCtrl.create({
        message: '请填写支付方式',
        duration: 2500
      });
      await toast.present();
      return;
    }
    if (!this.tag || this.tag.length <= 0) {
      const toast = await this.toastCtrl.create({
        message: '请先选择标签',
        duration: 2500
      });
      await toast.present();
      return;
    }

    this.isSubmiting = true;
    if (this.edit) {
      this.updateBill();
    } else {
      this.createBill();
    }
  }

  updateBill() {
    this.billService.updateBill(this.newBill._id, {
      create_at: new Date(this.newBill.date).toISOString(),
      amount: this.newBill.amount,
      asset: this.newBill.asset,
      tag: this.tag.join(','),
      note: this.newBill.note,
      type: this.newBill.type
    }).subscribe(ret => {
      if (ret) {
        ret.asset = {
          _id: ret.asset,
          name: this.findAssetName(ret.asset)
        };
        this.modalCtrl.dismiss(ret);
        this.resetFormData();
      }
    }, () => {
      this.isSubmiting = false;
    }, () => { });
  }

  createBill() {
    this.billService.createBill({
      create_at: new Date(this.newBill.date).toISOString(),
      amount: this.newBill.amount,
      asset: this.newBill.asset,
      tag: this.tag.join(','),
      note: this.newBill.note,
      type: this.newBill.type
    }).subscribe(ret => {
      if (ret) {
        ret.asset = {
          _id: ret.asset,
          name: this.findAssetName(ret.asset)
        };
        this.modalCtrl.dismiss(ret);
        this.resetFormData();
      }
    }, () => {
      this.isSubmiting = false;
    }, () => { });
  }

  resetFormData(amount?) {
    this.newBill = {
      _id: '',
      date: new Date().toISOString(),
      amount: amount ? amount : null,
      asset: '',
      tag: '',
      note: '',
      type: '支出'
    };
    if (this.assetList && this.assetList.length > 0) {
      this.newBill.asset = this.assetList[0]._id;
    }
    this.tag = [];
    this.clearSelectedTag();
  }

  clearSelectedTag() {
    this.payTags.map(val => {
      val.selected = false;
    });
    this.incomeTags.map(val => {
      val.selected = false;
    });
  }

  changePayWay(evt) {
    this.newBill.asset = evt.detail.value;
  }

  changeBillType(evt) {
    if (this.edit) {
      this.clearSelectedTag();
    } else {
      this.resetFormData(this.newBill.amount);
    }
    this.newBill.type = evt.detail.value;
  }

  findAssetName(assetid) {
    for (let index = 0; index < this.assetList.length; index++) {
      const element = this.assetList[index];
      if (element._id === assetid) {
        return element.name;
      }
    }
    return '';
  }

  selectTag(item) {
    item.selected = !item.selected;
    if (item.selected) {
      if (this.tag.indexOf(item.name) > -1) {
      } else {
        this.tag.push(item.name);
      }
    } else {
      if (this.tag.indexOf(item.name) > -1) {
        this.tag.splice(this.tag.indexOf(item.name), 1);
      }
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
