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

  title = "";

  newBill = {
    _id: '',
    date: new Date().toISOString(),
    amount: null,
    asset: '',
    tag: '',
    note: '',
    type: '支出'
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
      name: '运动', selected: false
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
      name: '资产互转', selected: false
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
      name: '数据校正', selected: false
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
        date: new Date(new Date(this.item.create_at).getTime() + 8 * 3600 * 1000).toISOString(),
        amount: this.item.amount,
        asset: this.item.asset._id,
        tag: this.item.tag.split(','),
        note: this.item.note,
        type: this.item.type
      };
      this.title = '编辑账单';
      setTimeout(() => {
        this.initSelectedTag(this.newBill.tag, this.newBill.type);
      }, 10)
    } else {
      this.title = '新增账单';
      this.newBill.date = new Date(new Date().getTime() + 8 * 3600 * 1000).toISOString();
    }

    this.initAssetSelect();
  }

  initSelectedTag(tags, type) {
    if (tags && tags.length > 0) {

      for (let index = 0; index < tags.length; index++) {
        const tag = tags[index];
        if (type === '支出') {
          for (let index = 0; index < this.payTag1.length; index++) {
            const tag1 = this.payTag1[index];
            if (tag === tag1.name) {
              tag1.selected = true;
            }
          }

          for (let index = 0; index < this.payTag2.length; index++) {
            const tag2 = this.payTag2[index];
            if (tag === tag2.name) {
              tag2.selected = true;
            }
          }
        } else if (type === '收入') {
          for (let index = 0; index < this.payTag3.length; index++) {
            const tag3 = this.payTag3[index];
            if (tag === tag3.name) {
              tag3.selected = true;
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
            if (element._id === this.newBill._id) {
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

  async submitBill() {
    if (!this.newBill.amount) {
      let toast = await this.toastCtrl.create({
        message: '请输入金额',
        duration: 2500
      });
      await toast.present();
      return;
    }

    if (!this.newBill.asset) {
      let toast = await this.toastCtrl.create({
        message: '请填写支付方式',
        duration: 2500
      });
      await toast.present();
      return;
    }
    if (!this.tag) {
      let toast = await this.toastCtrl.create({
        message: '请先选择标签',
        duration: 2500
      });
      await toast.present();
      return;
    }

    if (this.edit) {
      this.updateBill();
    } else {
      this.createBill();
    }

  }

  updateBill() {
    this.billService.updateBill(this.newBill._id, {
      create_at: new Date(new Date(this.newBill.date).getTime() - 8 * 3600 * 1000).toISOString(),
      amount: this.newBill.amount,
      asset: this.newBill.asset,
      tag: this.tag.join(','),
      note: this.newBill.note,
      type: this.newBill.type
    }).subscribe(ret => {
      if (ret) {
        ret.asset = {
          name: this.findAssetName(ret.asset)
        };
        this.modalCtrl.dismiss(ret)
        this.resetFormData();
      }
    });
  }

  createBill() {
    this.billService.createBill({
      create_at: new Date(new Date(this.newBill.date).getTime() - 8 * 3600 * 1000).toISOString(),
      amount: this.newBill.amount,
      asset: this.newBill.asset,
      tag: this.tag.join(','),
      note: this.newBill.note,
      type: this.newBill.type
    }).subscribe(ret => {
      if (ret) {
        ret.asset = {
          name: this.findAssetName(ret.asset)
        };
        this.modalCtrl.dismiss(ret)
        this.resetFormData();
      }
    });
  }

  resetFormData() {
    this.newBill = {
      _id: '',
      date: new Date(new Date().getTime() + 8 * 3600 * 1000).toISOString(),
      amount: null,
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
      this.resetFormData();
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
