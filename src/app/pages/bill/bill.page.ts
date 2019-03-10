import { ModalController, ToastController } from '@ionic/angular';
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
    date: new Date().toISOString(),
    amount: null,
    asset: '',
    tag: '',
    note: '',
    type: '支出'
  };
  billList;
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
      name: '人情红包', selected: false
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
      name: '借款', selected: false
    },
    {
      name: '红包', selected: false
    },
    {
      name: '活动奖励', selected: false
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
    private toastCtrl: ToastController
  ) {
    this.rebirthProvider.headers({ Authorization: this.globalservice.token }, true);
  }

  ngOnInit() {
    this.newBill.date = new Date(new Date().getTime() + 8 * 3600 * 1000).toISOString();
    this.initAssetSelect();
    this.getBillList();
  }

  initAssetSelect() {
    this.assetService.getAssets().subscribe(ret => {
      this.assetList = ret;
      if (this.assetList && this.assetList.length > 0) {
        this.newBill.asset = this.assetList[0]._id;
      }
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
        if (this.billList) {
          this.billList.unshift(ret);
        } else {
          this.billList = [ret];
        }
      }
    });
  }

  findAssetName(assetid) {
    for (let index = 0; index < this.assetList.length; index++) {
      const element = this.assetList[index];
      if (element._id = assetid) {
        return element.name;
      }
    }
    return '';
  }

  deleteBillRecord(item, index) {
    this.billService.deleteBill(item._id).subscribe(ret => {
      this.billList.splice(index, 1);
    });
  }

  changePayWay(evt) {
    this.newBill.asset = evt.detail.value;
  }

  changeBillType(evt) {
    this.newBill.type = evt.detail.value;
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
