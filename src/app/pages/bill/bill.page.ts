import { ModalController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AssetComponent } from './asset/asset.component';
import { GlobalService } from '@services/global.service';
import { RebirthHttpProvider } from 'rebirth-http';
import { OnlineAssetService } from '@services/data/asset/asset.service';
import { OnlineBillService } from '@services/data/bill/bill.service';
import { EmitService } from '@services/emit.service';

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
    date: new Date().toISOString(),
    amount: null,
    asset: '',
    tag: '',
    note: '',
    type: '支出'
  };
  billList;
  assetList = [];
  totalCost = 0;
  totalIncome = 0;
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
    private globalservice: GlobalService,
    private rebirthProvider: RebirthHttpProvider,
    private assetService: OnlineAssetService,
    private billService: OnlineBillService,
    private toastCtrl: ToastController,
    private emit: EmitService
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
    this.newBill.date = new Date(new Date().getTime() + 8 * 3600 * 1000).toISOString();
    this.initAssetSelect();
    this.getBillList(refresher);

    this.emit.eventEmit.subscribe(ret => {
      if (ret === 'assetChange') {
        this.initAssetSelect();
      }
    });
  }

  initAssetSelect() {
    this.assetService.getAssets().subscribe(ret => {
      this.assetList = ret;
      if (this.assetList && this.assetList.length > 0) {
        this.newBill.asset = this.assetList[0]._id;
      }
    });
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

  showBillForm() {
    this.showAdd = !this.showAdd;
  }

  /**
   * 新增支付记录
   */
  async submitBill() {
    this.showAdd = false;
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
        if (ret.type === '支出') {
          this.totalCost += ret.amount;
        } else {
          if (ret.type === '收入') {
            this.totalIncome += ret.amount;
          }
        }
        if (this.billList) {
          this.billList.unshift(ret);
        } else {
          this.billList = [ret];
        }
        this.resetFormData();
      }
    });
  }

  resetFormData() {
    this.newBill = {
      date: new Date().toISOString(),
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
    this.resetFormData();
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

}
