import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AssetComponent } from './asset/asset.component';

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
  date;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.date = new Date();
  }

  async toAssetManagement() {
    const modal = await this.modalCtrl.create({
      component: AssetComponent
    });

    await modal.present();
  }

  addBill() {
    this.showAdd = !this.showAdd;
  }

  submitBill() {
    this.showAdd = false;
  }

}
