import { ToastController, ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { OnlineAssetService } from '@services/data/asset/asset.service';
import { OnlineBillService } from '@services/data/bill/bill.service';

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
  payTag1 = [
    {
      name: '吃饭', selected: false
    },
    {
      name: '零食水果', selected: false
    },
    {
      name: '交通', selected: false
    },
    {
      name: '日常用品', selected: false
    },
    {
      name: '衣服', selected: false
    },
    {
      name: '文娱', selected: false
    },
    {
      name: '物业费', selected: false
    },
    {
      name: '理财', selected: false
    },
    {
      name: '书籍教育', selected: false
    },
  ];
  payTag2 = [
    {
      name: '人情红包', selected: false
    },
    {
      name: '通讯', selected: false
    },
    {
      name: '运动', selected: false
    },
    {
      name: '房租', selected: false
    },
    {
      name: '旅游', selected: false
    },
    {
      name: '数码', selected: false
    },
    {
      name: '公益', selected: false
    },
    {
      name: '数据校正', selected: false
    },
    {
      name: '其它', selected: false
    }
  ];
  payTag3 = [
    {
      name: '工资', selected: false
    },
    {
      name: '理财', selected: false
    },
    {
      name: '红包', selected: false
    },
    {
      name: '过节费', selected: false
    },
    {
      name: '活动奖励', selected: false
    },
    {
      name: '兼职', selected: false
    },
    {
      name: '数据校正', selected: false
    },
    {
      name: '其它', selected: false
    }
  ];

  dateStr;

  constructor(
    private modalCtrl: ModalController,
    private assetService: OnlineAssetService,
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
      setTimeout(() => {
        this.initSelectedTag(this.newBill.tag, this.newBill.type);
      }, 10);
    } else {
      this.title = '新增账单';
      this.newBill.date = new Date().toISOString();
      this.assetExchange.date = new Date().toISOString();
    }

    this.initAssetSelect();
  }

  initSelectedTag(tags, type) {
    if (tags && tags.length > 0) {
      this.tag = [];
      for (let index = 0; index < tags.length; index++) {
        const tag = tags[index];
        if (type === '支出') {
          for (let index = 0; index < this.payTag1.length; index++) {
            const tag1 = this.payTag1[index];
            if (tag === tag1.name) {
              tag1.selected = true;
              this.tag.push(tag1.name);
            }
          }

          for (let index = 0; index < this.payTag2.length; index++) {
            const tag2 = this.payTag2[index];
            if (tag === tag2.name) {
              tag2.selected = true;
              this.tag.push(tag2.name);
            }
          }
        } else if (type === '收入') {
          for (let index = 0; index < this.payTag3.length; index++) {
            const tag3 = this.payTag3[index];
            if (tag === tag3.name) {
              tag3.selected = true;
              this.tag.push(tag3.name);
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
    debugger;
    if (!this.isSubmiting) {
      if (this.newBill.type !== "资产互转") {
        this.createOrUpdateBill();
      } else {
        this.submitAssetExchange();
      }
    }
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
    }, () => {});

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
    }, () => {});
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
    }, () => {});
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
    this.payTag1.map(val => {
      val.selected = false;
    });
    this.payTag2.map(val => {
      val.selected = false;
    });
    this.payTag3.map(val => {
      val.selected = false;
    });
  }

  changePayWay(evt) {
    this.newBill.asset = evt.detail.value;
  }

  changeBillType(evt) {
    if (this.edit) {
      this.newBill.type = evt.detail.value;
      this.clearSelectedTag();
    } else {
      this.resetFormData(this.newBill.amount);
      this.newBill.type = evt.detail.value;
    }
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
